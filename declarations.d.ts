declare module "next/link";
declare module "next/image";
declare module "next/navigation";

declare module "next" {
  export type Metadata = Record<string, any>;
  export default function RootLayout(props: { children?: React.ReactNode }): JSX.Element;
}

declare module "next/server" {
  export class NextResponse {
    static json(body: any, init?: any): NextResponse;
  }
}

declare module "bcryptjs" {
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function hash(data: string, saltRounds: number): Promise<string>;
}

declare module "next-auth/providers/credentials" {
  export default function CredentialsProvider(config: any): any;
}
