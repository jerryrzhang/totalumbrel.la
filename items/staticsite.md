---
title: "totalumbrel.la - Static Site Generator using Next.js"
date: "2025-04-19"
tags: ["project"]
---

<span class="first">T</span>his post is about its own parent site, a statically generated portfolio built using Next.js. All of the posts written before this date were actually written in retrospect, and dated for when the projects were created.

> You can find a publically available github repo, including the raw markdown blog files on [my github](https://github.com/jerryrzhang/totalumbrel.la)

So how does this site actually work? 🤔

<figure class="center-image">
  <Image src="images/staticsite/flowchart.png" alt="Alt text"/>
  <figcaption>low effort flow chart courtesy of <a href = "https://app.diagrams.net/">draw.io</a></figcaption>
</figure>

As seen in the above flowchart, the site is generated statically using Next.js with the functions `getStaticPaths()` and `getStaticProps()`. 

On build time, a template file `[name].tsx` otherwise commonly called `[slug].tsx` calls the functions `getStaticPaths()`

```javascript line-numbers
export const getStaticPaths = async () => {

  const files = fs.readdirSync('items') //read item folder

  return {
    paths: files.map(filename => ({ //for each item
      params: {
        name: filename.replace(".md", "") //removes .md from file name
      }
    })),
    fallback: false
  }
}
```

which instantiates a new page for every file in the directory 'items'.

Each of these pages then calls a `getStaticProps()` with its own name pass through as an arguement wrapped in an object, which pulls the pages header and contents, and parses contents from markdown to html using [remarkjs](https://github.com/remarkjs/remark).

```javascript
export const getStaticProps = async ({params: { name }}) => {

  //Each file has its contents pulled out
  const contents = fs.readFileSync(path.join('items',name+'.md')).toString();
  //Split into an object with a metadata header
  const parsedContents = matter(contents);
  //Parsed into html with prism syntax highlighting
  const processedContent = await remark()
    .use(html, { sanitize: false })
    .use(prism) 
    .process(parsedContents.content);
  //Converted from json to string
  const markdownContents = processedContent.toString();

  return {
    props: {
      //properties of contents and data are returned
      contents: markdownContents, //String
      data: parsedContents.data //Object with fields from header
    }
  }
}
```


The header is formatted as such (with this project as an example)
```javascript
---
title: "A Next.js Static Site Generator"
date: "2025-04-19"
tags: ["project"]
---
```
Each field value pair is parsed into a data object with [gray matter](https://www.npmjs.com/package/gray-matter).


Then, these properties are passed to the page to be rendered with JSX expressions and dangerously setting innerhtml as a HTML attribute.

```javascript
<div className="markdownbody" dangerouslySetInnerHTML={{ __html: contents }}></div>
```

All of the individual pages are pulled together with a hyperlink index in index.tsx

```javascript
{projects.map((name) =>  <li key={name.data.title}><Link className="linkClass" href={`/${name.filename}`}>{name.data.title}</Link></li>)} // for projects

{misc.map((name) =>  <li key={name.data.title}><Link className="linkClass" href={`/${name.filename}`}>{name.data.title}</Link></li>)}// for misc
```
> I could never figure out how to style this stupid horizontal scroll bar...

Code density wise this project is pretty light, but it took me a few different approaches and perspectives to get it up and running. A *lot* was learnt about how Next.js works. 🤗

That is basically it for the core logic, everything else is filler and boilerplate.

For being such a simple site, I spent a surprisingly long amount of time working on the css... I guess I always do (I hate css 😭). But hey, in the end it turned out a pretty sleek design. I want to find a way to statically add images or thumbnails onto the entries but... I guess thats for a later date.