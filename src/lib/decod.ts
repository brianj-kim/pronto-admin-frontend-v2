
export const Decode = () => {
  const decoder = (str: string) => {
   
    const decode = str
                      .replace(/-/g, "+")
                      .replace(/_/g, "/");

    return JSON.parse(atob(decode));
  }

  return { decoder }
}