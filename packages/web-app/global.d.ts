declare module "*.jpg" {
    const path: string;
    export default path;
}

declare module "*.png" {
    const path: string;
    export default path;
}

type StaticImageData = {
    src: string;
    height: number;
    width: number;
    placeholder?: string;
  };
  
  declare module '*.gif' {
    const content: StaticImageData;
    export default content;
  };