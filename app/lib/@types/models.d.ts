//イベントの送信およびブロードキャスト時に使用される型定義
export type ServerToClientEvents = {
  hello: (message: string) => void;
  sync: () => void;
};

//イベント受信時に使用する型定義
export type ClientToServerEvents = {
  message: (message: string) => void;
  player: (name: string) => void;
  onSubmit: () => void;
};
