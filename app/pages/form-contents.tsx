import type { FormContent } from '@/lib/@types/form-content';
import { Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface FormContentsProps {
  contents: FormContent[]
}

const FormContents: NextPage<FormContentsProps> = ({ contents: staticContents }) => {

  const socket = io({ autoConnect: false });

  const [contents, setContents] = useState<FormContent[]>(staticContents);

  const fetching = async () => {
    const req = await fetch('/api/form-contents');
    const { contents } = await req.json();
    setContents((contents ?? []) as FormContent[]);
  };

  // １回だけ実行
  useEffect(() => {
    // socket.ioサーバを起動するapiを実行
    fetch('/api/socketio', { method: 'POST' })
      .then(() => {
        // 既に接続済だったら何もしない
        if (socket.connected) {
          return;
        }
        // socket.ioサーバに接続
        socket.connect();
        socket.on('sync', () => {
          console.log('sync');
          fetching();
        });
        fetching();
      });

    return () => {
      // 登録したイベントは全てクリーンアップ
      socket.off('connect');
      socket.off('msg');
    };
  }, []);

  return <>
    <Head>
      <title>お問合せフォーム</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box>
      <Heading p={3} textAlign="center">お問合せ一覧</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>名前</Th>
            <Th>メールアドレス</Th>
            <Th>内容</Th>
            <Th>送信日時</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            contents.length > 0 && contents.map((item, index) => (
              <Tr key={index}>
                <Td>{item.id}</Td>
                <Td>{item.name}</Td>
                <Td>{item.email}</Td>
                <Td>{item.content_question}</Td>
                <Td>{item.postdate}</Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
    </Box>
  </>;
};

export const getStaticProps: GetStaticProps<FormContentsProps> = async () => {

  try {

    const req = await fetch('http://localhost:3000/api/form-contents');
    const { contents } = await req.json();

    return {
      props: {
        contents: contents ?? [],
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        contents: [],
      },
    };
  }
};

export default FormContents;