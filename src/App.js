import './App.css';
import { useEffect, useState } from 'react';
import ReactLoader from 'react-single-loader'
import 'react-single-loader/dist/index.css'

function App() {

  const [currencyCode, setCurrencyCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [conversionToAllCurrency, setConversionToAllCurrency] = useState({})
  const [currencyToCountryCode, setCurrencyToCountryCode] = useState({})
  const [defaultSelectedCurrency , setDefaultSelectedCurrency] = useState("USD")
  const [showCurrencyDropDown, setShowCurrencyDropDown] = useState(false)
  const [filteredCurrencyConvertedList, setFilteredCurrencyConvertedList] = useState({})
  const [error,setError] = useState({
    amount:null,
    currencyCode: null
  })
  const [isFilter, setIsFilter] = useState(false)
  const [showTooleTip, setShowTooleTip] = useState({
    index: null,
    content:''
  })

  const convertCurrency =  async () => {
    try {
      if(/^[1-9][0-9]*$/.test(amount))
      {
        setError({amount:null,currencyCode:null})
        setIsLoading(true)
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_EXCHANGE_RATE_API_KEY}/latest/${defaultSelectedCurrency}`)
        const res = await response.json()
        
        const response_ = await fetch('https://restcountries.com/v3.1/all');
        const countries = await response_.json();
        let currencyToCountryCode = {}

        countries.forEach(country => {
            const currencies = country.currencies;
            if (currencies) {
                for (const [code, currency] of Object.entries(currencies)) {
                    currencyToCountryCode[code] = { code: country.cca2.toLowerCase(), fullName: country.name.common }; // cca2 is the country code
                }
            }
        });
        setCurrencyToCountryCode(currencyToCountryCode)
        setFilteredCurrencyConvertedList(currencyToCountryCode)
        const conversionToAllCurrency = {}
        Object.keys(res?.conversion_rates).map((item)=> {
          conversionToAllCurrency[item] = res?.conversion_rates[item]*amount
    })
    setConversionToAllCurrency(conversionToAllCurrency)
  }else{
    setError({amount:'Please enter valid amount',currencyCode:null})
  }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  const filter = () => {
    if(/^([A-Z]{3})(,([A-Z]{3}))*$/.test(currencyCode)){
      setError({amount:null,currencyCode:null})
      setIsLoading(true)
      const userSelectedCurrencyCode = currencyCode.split(',')
      const filteredCurrencyConvertedList = {}
      userSelectedCurrencyCode.map((item) => 
      { filteredCurrencyConvertedList[item.toUpperCase()] = conversionToAllCurrency[item.toUpperCase()] })
      setFilteredCurrencyConvertedList(filteredCurrencyConvertedList)
      setIsFilter(true)
      setIsLoading(false)
  }else{
    setError({amount:null,currencyCode:'Please enter valid currency code'})
  }
  }
  return (
    <div className="App font-['Outfit']">
    {isLoading && <ReactLoader color="blue"/>}
      <div className='p-4'>
      <div className="max-w-xl mx-auto">
        <div className="flex flex-row max-[425px]:flex-col ">
            <div className="relative w-full">
              <div>
                <p onClick={Object.keys(conversionToAllCurrency).length > 0 ?()=>setShowCurrencyDropDown(!showCurrencyDropDown) : ()=>{}} className='absolute top-0 bg-blue-300 -left-1 border border-blue-300 h-full p-2.5 text-sm font-medium text-white  rounded-l-lg border '>{defaultSelectedCurrency}</p>
              </div>
                <input type="search" onChange={(e)=>setAmount(e.target.value)} className="block p-2.5 pl-14 w-full z-20 text-sm text-gray-900 rounded-lg  border border-gray-300 focus:outline-none focus:border-blue-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-300" placeholder="Enter amount" required />
                <button onClick={convertCurrency} type="submit"  className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-300 rounded-e-lg border border-blue-300 hover:bg-blue-300  focus:outline-none dark:outline-none  dark:hover:outline-none  dark:focus:outline-none ">
                  <p>Convert</p>
                </button>
            </div>
            {Object.keys(conversionToAllCurrency).length > 0 && 
              <div className='flex flex-col mx-2 max-[425px]:my-2 max-[425px]:items-center'>
                <button onClick={()=>setShowCurrencyDropDown(!showCurrencyDropDown)} data-dropdown-toggle="dropdown" className="w-fit text-white bg-blue-300 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-300 dark:focus:ring-blue-300" type="button">Currency
                  <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
              </div>}
        </div>
        {error.amount != null && <p className='text-red-500 text-left'>{error.amount}</p>}
        
      </div>
      {Object.keys(conversionToAllCurrency).length >0 &&<div className="max-w-md mx-auto my-3">
        <div className="flex">
            <div className="relative w-full">
                <input value={currencyCode} onChange={(e)=>setCurrencyCode(e.target.value)} type="search" className="block p-2.5 w-full z-20 text-sm text-gray-900 rounded-lg  border border-gray-300 focus:outline-none focus:border-blue-300 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-300" placeholder="Enter Currency Code(s)" required />
                <button onClick={filter} type="submit" className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-300 rounded-e-lg border border-blue-300 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-300 dark:focus:ring-blue-300">
                  <p>Filter</p>
                </button>
            </div>
        </div>
        <p className='w-fit text-xs ml-3 text-gray-500'>use "," after every Currency Code in text box</p>
        {error.currencyCode != null && <p className='text-red-500 text-left'>{error.currencyCode}</p>}
      </div>}
      </div>
      <div className='flex flex-wrap overflow-scroll h-[77vh]'>
        {Object.keys(conversionToAllCurrency).length >0 && Object.keys(isFilter ? filteredCurrencyConvertedList : conversionToAllCurrency).map(item=>{
          return (currencyToCountryCode[item] !== undefined && 
            <div className='h-fit m-3 cursor-pointer block max-w-xs p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'>
              <img src={`https://flagcdn.com/h40/${currencyToCountryCode[item].code}.png`} className='m-auto' />
              <div className='flex row  justify-between items-center m-2'>
                <h5 className="m-0 text-2xl font-medium tracking-tight text-gray-900 dark:text-white font-['Outfit']">{item}</h5>
              </div>
                <p className="mx-2 font-normal text-gray-700 dark:text-gray-400">{conversionToAllCurrency[item]}</p>
            </div>
          )
        })}
      </div>

      <div tabIndex="-1" aria-hidden="true" className={`${showCurrencyDropDown ? 'display' : 'hidden' }  scroll overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
    <div className="relative p-4 w-full max-w-2xl max-h-full m-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-2 md:p-2 border-b rounded-t dark:border-gray-600">
                <p className='font-bold mx-2'>Select country code</p>
                <button onClick={()=>setShowCurrencyDropDown(!showCurrencyDropDown)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            <div className="p-4 flex flex-wrap row">
            {Object.keys(conversionToAllCurrency).map((item, index)=>
                <p onClick={()=>{
                  setShowCurrencyDropDown(!showCurrencyDropDown)
                  setDefaultSelectedCurrency(item)
                  setCurrencyCode('')
                }} onMouseOver={()=> { currencyToCountryCode[item] && setShowTooleTip({index,content:currencyToCountryCode[item].fullName}) }}
                onMouseLeave={()=>setShowTooleTip({index:null,content:''})}
                className="m-0  w-fit cursor-pointer px-2 self-center py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item}
                 {currencyToCountryCode[item] != undefined && index === showTooleTip.index && <span className='shadow px-2 font-bold absolute bg-white -mx-2 -my-3 '>{showTooleTip.content}</span>}
                </p>
                    )}
            </div>
        </div>
    </div>
</div>
    </div>
  );
}

export default App;
