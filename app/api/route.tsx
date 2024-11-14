import { init, fetchQuery } from "@airstack/node";
import { type NextRequest, NextResponse } from "next/server";

// ローカル環境変数から値を読み取り、変数"apiKey"に格納
const apiKey = process.env.AIRSTACK_API_KEY;
// 変数"apiKey"が存在するかを確認
if (!apiKey) {
  throw new Error("AIRSTACK_API_KEY is not defined");
}
// APIキーの初期化
init(apiKey);

// "Airstack API"からデータの取得をするためのクエリを定義
// 正しいクエリ文を作成するには https://app.airstack.xyz/api-studio でのリクエストテストを推奨
const userDataQuery = `
  query MyQuery($userId: String!) {
    Socials(input: {blockchain: ethereum, filter: {userId: {_eq: $userId}}}) {
      Social {
        userId
        profileName
        profileDisplayName
        profileBio
        profileImage
        followerCount
        followingCount
      }
    }
  }
`;

// APIにリクエストがあった場合の処理
export async function GET(req: NextRequest) {
  // リクエストから"userId"パラメータを取得
  const userId = req.nextUrl.searchParams.get("userId");
  //　取得した"userId"パラメータの値をコンソールログに出力"
  console.log("Requester userId:", userId);
  // "userId"が存在しない場合のエラーハンドリング
  if (!userId) {
    console.log("Error: userId parameter is missing");
    return NextResponse.json({ error: "userId parameter is required" }, { status: 400 });
  }
  try {
    // "Airstack API"からデータを取得
    const [response] = await Promise.all([fetchQuery(userDataQuery, { userId })]);
    // "Airstack API"レスポンスにエラーが含まれている場合の処理
    if (response.error) {
      console.error("Airstack API Error (User Data):", response.error);
      return NextResponse.json({ error: response.error.message }, { status: 500 });
    }
    console.log("userData: %o", response.data);
    // ユーザーデータを"JSON"形式で返す
    return NextResponse.json({
      userData: response.data,
    });
  } catch (error) {
    // 予期しないエラーが発生した場合の処理
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
