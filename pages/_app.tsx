// pages/_app.tsx

import Layout from "@/components/ui-items/Layout";
import ReactQueryProvider from "@/components/ui-items/ReactQueryProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { StringProvider } from "@/components/ui-items/CurrencyProvider";

// import dynamic from 'next/dynamic';

// const ReactQueryProvider = dynamic(() => import('../components/ReactQueryProvider'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Head>
        <title>MEGASTROY dashboard</title>
        <meta name="description" content="Welcome to MEGASTROY" />
      </Head>
      <Layout>
        <StringProvider>
          <Component {...pageProps} />
          <ToastContainer />
        </StringProvider>
      </Layout>
    </ReactQueryProvider>
  );
}
