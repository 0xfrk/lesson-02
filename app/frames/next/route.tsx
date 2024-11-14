import { Button } from "frames.js/next"; // ボタンコンポーネントをインポート
import { frames } from "app/frames/frames"; // フレームをインポート
import { appURL } from "app/utils"; // appURLを取得するための関数をインポート

// リクエストを処理する非同期関数を定義
const handleRequest = frames(async (ctx) => {
  // 変数を定義
  let error: string | null = null; // エラーメッセージを格納する変数
  let isLoading = false; // データを読み込んでいるかどうかのフラグ

  // ユーザーデータを取得する非同期関数
  const fetchUserData = async (fid: string) => {
    isLoading = true; // 読み込み中フラグを立てる
    try {
      // APIのURLを作成
      const airstackUrl = `${appURL()}/api?userId=${encodeURIComponent(fid)}`;
      // APIからデータを取得
      const airstackResponse = await fetch(airstackUrl);
      // APIからデータを取得できなかった場合の処理
      if (!airstackResponse.ok) {
        throw new Error(`Airstack HTTP error! status: ${airstackResponse.status}`); // エラーハンドリング
      }
    } catch (err) {
      console.error("Error fetching data:", err); // エラーをコンソールログに表示
      error = (err as Error).message; // エラーメッセージを格納
    } finally {
      isLoading = false; // 読み込み中フラグを下げる
    }
  };

  let fid: string | null = null; // ユーザーのFIDを格納する変数

  // リクエストからFIDを取得
  if (ctx.message?.requesterFid) {
    fid = ctx.message.requesterFid.toString(); // FIDを文字列に変換
    console.log("Using requester FID:", fid); // 使用するFIDをコンソールログに表示
  } else {
    console.log("No ctx.url available"); // FIDがない場合にメッセージをコンソールログに表示
  }
  console.log("Final FID used:", fid); // 最終的に使用するFIDをコンソールログに表示

  // fidが存在する場合にユーザーデータを取得
  if (fid) {
    await Promise.all([fetchUserData(fid)]); // ユーザーデータを非同期で取得
  }

  // レスポンスを返す
  return {
    image: `${appURL()}/02.png`, // 画像のURL
    buttons: [
      <Button action="post" key="SplashScreen" target="/">
        最初のページへ
      </Button>,
    ],
  };
});

// GETリクエストとPOSTリクエストの両方にhandleRequestをエクスポート
export const GET = handleRequest;
export const POST = handleRequest;
