import { Button } from "frames.js/next";
import { frames } from "app/frames/frames";
import { appURL } from "app/utils";

const handleRequest = frames(async (ctx) => {
  return {
    image: `${appURL()}/01.png`,
    buttons: [
      <Button action="post" key="NextScreen" target="/next">
        次のページへ
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
