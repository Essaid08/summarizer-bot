import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import imgLogo from '../../public/logo.png'
import { useLazyGetSummaryQuery } from '../services/article';

const Demo = () => {

  const [examples] = useState([
    'https://www.securityweek.com/microsoft-says-russian-gov-hackers-stole-source-code-after-spying-on-executive-emails/',
    "https://www.nsw.gov.au/media-releases/womens-service-to-australias-military-honoured-international-womens-day",
    'https://edition.cnn.com/2024/03/07/opinions/climate-scientist-scare-doom-anxiety-mcguire/index.html'
  ]
  )
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  })
  const [allArticles, setAllArticles] = useState([])
  const [copied, setCopied] = useState('')
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    try {
      const articlesFromLocalStorage = JSON.parse(localStorage.getItem('articles'));
      if (articlesFromLocalStorage && Array.isArray(articlesFromLocalStorage)) {
        setAllArticles(articlesFromLocalStorage);
      } else {
        setAllArticles([]); // Set to empty array if localStorage data is invalid
      }
    } catch (error) {
      console.error("Error retrieving articles from localStorage:", error);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };


      const updatedAllAricles = [newArticle, ...allArticles]

      setArticle(newArticle);
      setAllArticles(updatedAllAricles)
      localStorage.setItem('articles', JSON.stringify(updatedAllAricles))
    }
  }

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <section className="mt-6 w-full max-w-xl">
      {/*examples section */}
      <h2 className="font-satoshi font-bold mb-4 text-center md:text-left text-gray-300 text-xl">
        Examples <span className="blue_gradient">Summary</span>
      </h2>
      <div className="mb-5 flex max-w-full flex-wrap items-center gap-2 md:gap-9 justify-center sm:justify-between">
        {
          examples.map((item, index) => (
            <div
              key={`exmp-${index}`}
              onClick={() => setArticle({
                ...article, url: item
              })}
              className=" text-center cursor-pointer border rounded-lg flex flex-col w-full items-center h-24 md:h-[160px] md:max-w-40 gap-1  bg-sky-100 hover:bg-sky-200 hover: py-2 px-2"
            >
              <div className='copy_btn' onClick={() => handleCopy(item)}>
                <img
                  src={copied === item ? tick : copy}
                  alt={copied === item ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='text-center flex-1 max-w-full md:max-w-[14ch] text-[10px] font-satoshi text-gray-900 font-medium text-sm overflow-hidden'>
                {item}
              </p>
            </div>
          ))
        }
      </div>
      {/* the Search div */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex mb-5 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img src={linkIcon} alt="link_icon" className="absolute left-0 my-2 ml-3 w-5" />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) => setArticle({
              ...article,
              url: e.target.value
            })}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 py-1 peer-focus:text-gray-700"
          >
            <p><img src={imgLogo} alt="submit" className="h-9" /></p>
          </button>
        </form>
        {/*history from localStorage*/}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles && allArticles.length > 0 && allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle({
                ...article,
                url: item
              })}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/*result display container */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className=" font-inter font-bold text-white text-center">Something went wronge , Please wait...
            <br />
            <span className="font-satoshi font-normal text-gray-300">
              {error?.data?.error}
            </span>
          </p>
        ) :
          (article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-center text-gray-300 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
          )}
      </div>
    </section>
  )
}

export default Demo
