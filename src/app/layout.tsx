import 'ress';
import GlobalStyle from './GlobalStyles';
import { SideBar } from '@/components/SideBar';
import { Layout } from '@/components/Layout';

export const metadata = {
  title: 'Document QA Sample',
  description: 'ドキュメントをもとにLLMに回答させるサンプル',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <GlobalStyle />
      <body>
        <Layout>
          <SideBar />
          {children}
        </Layout>
      </body>
    </html>
  );
}
