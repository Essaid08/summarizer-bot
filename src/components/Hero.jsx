import imgLogo from '../../public/logo.png'
import { FaGithub } from "react-icons/fa";

const Hero = () => {
  return (
    <header className="w-full flex justify-center items-center flex-col">
      <nav className='flex justify-between items-center w-full  pt-3'>
        <img src={imgLogo} alt="logo-app" className=' w-14 object-contain' />
        <button
          type='button'
          onClick={() => window.open('https://github.com/Essaid08/summarizer-bot' , '_blank')}  
          className='black_btn'
        >
          <FaGithub size={25}/>
        </button>
      </nav>
      <h1 className='head_text'>
          Free summarizer width <br  className='max-md:hidden'/>
          <span className='orange_gradient'>OpenAi GPT-4</span>    
      </h1>
      <h2 className='desc'>
      Please feel free to utilize our free summarizer, which is powered by GPT-4.
      Your article will be simplified by our bot,
      which will also shorten its length into a succinct summary.
      </h2>
    </header>
  )
}

export default Hero