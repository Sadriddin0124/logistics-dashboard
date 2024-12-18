// pages/_app.tsx

import Layout from "@/components/Layout";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// import dynamic from 'next/dynamic';

// const ReactQueryProvider = dynamic(() => import('../components/ReactQueryProvider'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ReactQueryProvider>
      <Head>
        <title>Logistics dashboard</title>
        <meta name="description" content="Welcome to Logistics" />
      </Head>
      <Layout>
        <Component {...pageProps} />
        <ToastContainer/>
      </Layout>
    </ReactQueryProvider>
  );
}