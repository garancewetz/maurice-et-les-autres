import { useEffect, useState } from 'react';
import { getSinglePost, getPosts } from '../../lib/posts';
import Landing from '../../components/layouts/Landing'

export default function Spectacle ({post}) {
 const [dates, setDates] = useState(null)
 const [src, setSource] = useState(post.feature_image)
 const [html, setHtml] = useState(post.html)
 const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

 useEffect(() => {
   if (post.codeinjection_foot !== null) {
     setDates(JSON.parse(post.codeinjection_foot))
   }
  }, [post.codeinjection_foot])

  useEffect(() => {
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(el => {
        el.setAttribute('height', '400')
        el.setAttribute('width', '700')
    });
  }, [])

  useEffect(() => {
    secureHttpImages(src, setSource)
    secureHttpImages(html, setHtml)
   }, [])

   function secureHttpImages (element, setter) {
    if (element.includes('http://')) {
      setter(element.replaceAll('http://', 'https://'))
     }
   }
  
  return (
    <Landing page={post} container={false}>
      <header className="relative">
        <div className="relative h-[35rem] bg-no-repeat bg-cover bg-center" style={{backgroundImage: `url(${src})`}}>
          <div className="absolute bg-black opacity-30 inset-0 z-10"></div>
          <div className='relative z-20 h-full flex flex-col justify-center items-center'>
            <h1 className="text-4xl lg:text-8xl mb-6 px-4 pt-4 lg:pt-[6.5rem] text-white text-center">{post.title}</h1>
            <h2 className="text-xl lg:text-2xl mb-6 px-4 text-white text-center">{post.excerpt}</h2>
          </div>
        </div>
      </header>
      <div className='py-10 lg:py-20 px-3 max-w-6xl mx-auto'>
      <div dangerouslySetInnerHTML={{ __html: html }} className='ghost-spectacle'/>
    </div>
    </Landing>
  )
}


export async function getStaticPaths() {
  const posts = await getPosts()

  // Get the paths we want to create based on posts
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  // { fallback: false } means posts not found should 404.
  return { paths, fallback: false }
}


// Pass the page slug over to the "getSinglePost" function
// In turn passing it to the posts.read() to query the Ghost Content API
export async function getStaticProps(context) {
  const post = await getSinglePost(context.params.slug)
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post }
  }
}
