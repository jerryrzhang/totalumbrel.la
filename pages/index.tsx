import Link from "next/link";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';

const Home = (filesMeta) => {
  console.log(filesMeta);
  //what the actual fuck??? i have no idea why filesMeta is wrapped around a smaller filesMeta? i cbb fixing tho so oh well
  const projects = filesMeta.filesMeta.filter((file) => file.data.tags.includes("project"))
  const misc = filesMeta.filesMeta.filter((file) => file.data.tags.includes("misc"))
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Head>
        <title>totalumbrel.la</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>
      <div className="flex flex-col items-left justify-between min-h-screen py-2 w-1/2">
        <header className="font-[Ubuntu] text-2xl width-full flex flex-row items-center mt-2 mb-4 justify-first font-normal height-10">
          <Link href="/" className="header">
            $ ls ~/totalumbrel.la
          </Link>
          <span className="cursor"></span>
        </header>
        <main className="width-full flex-grow flex flex-col items-left justify-first py-5">
          
          Hi. This is a website which aims to showcase and document things that I am making/have made.
          <div className="spacer"></div>
          I'm passionate about a lot of things, including engineering and programming. 
          <div className="spacer"></div>
          you can take a look at the projects that I've been working on,
          <ul className="list-disc pl-5">
            {projects.map((name) =>  <li key={name.data.title}><Link className="linkClass" href={`/${name.filename}`}>{name.data.title}</Link></li>)}
          </ul>
          <div className="spacer"></div><div className="spacer"></div>
          or check out blog posts on some other miscellaneous stuff
          <ul className="list-disc pl-5">
            {misc.map((name) =>  <li key={name.data.title}><Link className="linkClass" href={`/${name.filename}`}>{name.data.title}</Link></li>)}
          </ul>
          
          <div className="spacer"></div><div className="spacer"></div>
          I will continue to add things of interest in the future.
        </main>
        <footer className="mb-5 width-full flex flex-row items-center justify-between text-lg font-medium">
        <div>
         Jerry Zhang
        </div>
        <div>
          <a target = "_blank" href="https://github.com/jerryrzhang">
            <img src="/github.png" className="logo"/>
          </a>
        </div>
        </footer>
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  const files = fs.readdirSync("items").map(file => file.replace(/\.md$/, ""));
  const filesMeta = files.map((filename)=> {
    let contents =fs.readFileSync(path.join('items',filename+".md")).toString();
    let parsedContents = matter(contents);
    let data: { [key: string]: any } = parsedContents.data;
    return {filename, data}
  });
  console.log(filesMeta[0].data.title)
  return {
    props: {
      filesMeta
    }
  }
}

export default Home;