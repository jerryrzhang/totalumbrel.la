import React from "react";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Link from "next/link";
import '../app/globals.css';
import { remark } from 'remark';
import html from 'remark-html';
import prism from 'remark-prism'; 
import 'prismjs/themes/prism-tomorrow.css'; 



const Page = ({ contents, data, tags }) => {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Head>
          <title>totalumbrel.la - {data.title}</title>
          <link rel="icon" type="image/x-icon" href="/totalumbrel.la/favicon.ico"></link>
          </Head>
          <div className="flex flex-col items-left justify-between min-h-screen py-2 w-1/2">
            <header className="font-[Ubuntu] text-2xl width-full flex flex-row items-center mt-2 mb-4 justify-first font-normal height-10">
              <Link href="/" className="header">
                $ ls ~/totalumbrel.la
              </Link>
              <span className="cursor"></span>
            </header>
            <main className="width-full flex-grow flex flex-col items-left justify-first py-5">
              <div className="width-full flex flex-col">
                      <h1 className="text-3xl font-semibold">{data.title}</h1>
                      <div className="flex flex-row items-center justify-start">
                      <p className="text-sm font-light textName">{data.date}</p>
                      <div className="w-2/5 flex justify-start flex-row items-start mx-2">
                        {data.tags.map((tag2) =>  <div style = {{ color: tags[tag2]}}className="mx-1 text-base">#{tag2}</div>)}
                      </div>
                      </div>
              </div>
              <div className="markdownbody" dangerouslySetInnerHTML={{ __html: contents }}></div>
            </main>
            <footer className="mb-5 width-full flex flex-row items-center justify-between text-lg font-medium">
            <div>
            © Jerry Zhang
            </div>
            <div>
              <a target = "_blank" href="https://github.com/jerryrzhang">
                <img src="/totalumbrel.la/github.png" className="logo"/>
              </a>
            </div>
            </footer>
          </div>
        </div>
      );
  }

export const getStaticPaths = async () => {

  const files = fs.readdirSync('items')

  return {
    paths: files.map(filename => ({
      params: {
        name: filename.replace(".md", "")
      }
    })),
    fallback: false
  }
}

export const getStaticProps = async ({params: { name }}) => {

  const contents =fs.readFileSync(path.join('items',name+'.md')).toString();
  const parsedContents = matter(contents);
  const processedContent = await remark()
  .use(html, { sanitize: false })
  .use(prism) 
  .process(parsedContents.content);
  const markdownContents = processedContent.toString();

  const tags = fs.readFileSync(path.join('public','tags.dat')).toString();
  const conCatTags = tags.split("\n");
  const newTags = conCatTags.map((tagColor) => {
    const tag = tagColor.split("%");
    return tag;
  });
  const tagDictionary = {};
  for (let i = 0; i < newTags.length; i++) {
    tagDictionary[newTags[i][0]] = newTags[i][1];
  }

  return {
    props: {
      tags: tagDictionary,
      contents: markdownContents,
      data: parsedContents.data
    }
  }
}


export default Page;