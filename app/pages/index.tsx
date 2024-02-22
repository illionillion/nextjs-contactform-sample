import { Box, Button, Container, FormControl, FormErrorMessage, FormLabel, Heading, Input, Textarea } from '@chakra-ui/react';
import Head from 'next/head';
import type { SubmitHandler} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';

type Inputs = {
  name: string
  email: string
  email_confirmation: string
  content_question: string
}

export default function Home() {

  const {
    handleSubmit,
    register,
    getValues,
    trigger,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      name: '',
      email: '',
      email_confirmation: '',
      content_question: ''
    }
  });

  const socket = io({ autoConnect: false });

  const onSubmit: SubmitHandler<Inputs> = async () => {
    // ここで送信の処理
    try {

      const requestData = {
        name: getValues('name'),
        email: getValues('email'),
        content_question: getValues('content_question')
      };

      const request = await fetch('/api/send', { // 送信先URL
        method: 'post', // 通信メソッド
        headers: {
          'Content-Type': 'application/json' // JSON形式のデータのヘッダー
        },
        body: JSON.stringify(requestData) // JSON形式のデータ
      });

      console.log(await request.json());
      if (request.status === 200) { // 200なら成功
        console.log('成功');
        // 送信できたらリセット
        reset();
        clearErrors();
        // socket.emit('onSubmit'); // 送信
        await fetch("/api/socketio", { method: "POST" })
        // 既に接続済だったら何もしない
        if (socket.connected) {
          return;
        }
        // socket.ioサーバに接続
        socket.connect();
        socket.emit('onSubmit'); // 送信
      } else {
        console.log('失敗・・・？');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head>
        <title>お問合せフォーム</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container h="100svh" py={5}>
        <Box>
          <Heading p={3} textAlign="center">お問合せフォーム</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name || !!errors.email || !!errors.email_confirmation || !!errors.content_question}>
              <Box py={2}>
                <FormLabel htmlFor='name'>名前</FormLabel>
                <Input id='name' placeholder='名前'
                  {...register('name', {
                    required: '名前を入力してください',
                    minLength: { value: 2, message: '2文字以上は入力してください' },
                    maxLength: {value: 100, message: '100文字以内にしてください'}
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </Box>
              <Box py={2}>
                <FormLabel htmlFor='email'>メールアドレス</FormLabel>
                <Input id='email' type='email' placeholder='メールアドレス'
                  {...register('email', {
                    required: 'メールアドレスを入力してください',
                    onBlur: () => {
                      if (getValues('email')) {
                        trigger('email');
                      }
                    },
                    pattern: {
                      value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                      message: '入力形式がメールアドレスではありません。'
                    },
                    maxLength: {value: 100, message: '100文字以内にしてください'}
                  })}
                />
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </Box>
              <Box py={2}>
                <FormLabel htmlFor='email_confirmation'>メールアドレス（再入力）</FormLabel>
                <Input id='email_confirmation' type='email' placeholder='メールアドレス（再入力）'
                  {...register('email_confirmation', {
                    required: '確認のためにメールアドレスを入力してください',
                    validate: (value) => {
                      return (
                        value === getValues('email') || 'メールアドレスが一致しません'
                      );
                    },
                    maxLength: {value: 100, message: '100文字以内にしてください'}
                  })}
                />
                <FormErrorMessage>
                  {errors.email_confirmation && errors.email_confirmation.message}
                </FormErrorMessage>
              </Box>
              <Box py={2}>
                <FormLabel htmlFor='content_question'>ご質問内容（200文字以内）</FormLabel>
                <Textarea id='content_question' placeholder='ご質問内容を入力してください'
                  {...register('content_question', {
                    required: 'ご質問内容を入力してください',
                    maxLength: { value: 200, message: '200文字を超えています。' }
                  })}
                />
                <FormErrorMessage>
                  {errors.content_question && errors.content_question.message}
                </FormErrorMessage>
              </Box>
              <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                送信
              </Button>
            </FormControl>
          </form>
        </Box>
      </Container>
    </>
  );
}
