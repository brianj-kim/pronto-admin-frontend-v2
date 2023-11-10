import { User } from "./definitions";

export default function Actions () {
  const renameKeys = (newKey: string, obj: User) => {
    console.log(newKey, obj);
  }

  const checkExpired = (ex: number) => {
    return ex > Math.floor(Date.now() / 1000);
  }

  return { renameKeys, checkExpired };
}