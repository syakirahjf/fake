import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import FakeContract from '../blockchain/facemask'
import 'bulma/css/bulma.css'
import styles from '../styles/Fake.module.css'

const Fake = () => {
  const [product, searchProduct] = useState('')
  const [productid, setProduct] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [inventory, setInventory] = useState('')
  const [myFaceMaskCount, setMyFaceMaskCount] = useState('')
  const [buyCount, setBuyCount] = useState('')
  const [web3, setWeb3] = useState(null)
  const [address, setAddress] = useState(null)
  const [fakeContract, setFakeContract] = useState(null)
  const [memberAcc, setMember] = useState('')
  
  useEffect(() => {
    if (fakeContract && address) searchProductHandler()
    if (fakeContract) setProductHandler()
    if (fakeContract) getInventoryHandler()
    if (fakeContract) getMemberHandler()
    if (fakeContract && address) getMyFaceMaskCountHandler()
  }, [fakeContract, address])

  const getMemberHandler = async () => {
    const member = await fakeContract.methods.getMembers().call()
    getMember(member)
  }

  
  const searchProductHandler = async () => {
    const product = await fakeContract.methods.searchProduct().call()
    searchProduct(product)
  }

  const setProductHandler = async () => {
    const productid = await fakeContract.methods.setProduct().call()
    setProduct(productid)
  }

  const getInventoryHandler = async () => {
    const inventory = await fakeContract.methods.getFMBalance().call()
    setInventory(inventory)
  }

  const getMyFaceMaskCountHandler = async () => {
    const count = await fakeContract.methods.fmBalance(address).call()
    setMyFaceMaskCount(count)
  }

  const updateFaceMaskQty = event => {
    setBuyCount(event.target.value)
  }

  const buyFaceMaskHandler = async () => {
    try {
      await fakeContract.methods.purchase(buyCount).send({
        from: address,
        value: web3.utils.toWei('2', 'ether') * buyCount

      //console.log("try to purchase")
    })
        
      await fakeContract.methods.purchase(parseInt(buyCount)).send({
        from: address,
        value: web3.utils.toWei('2', 'ether') * buyCount,
        gas: 3000000,
        gasPrice: null

      })
      setSuccessMsg(`${buyCount} FaceMask purchased!`)

      if (fakeContract) getInventoryHandler()
      if (fakeContract && address) getMyFaceMaskCountHandler()
    } catch(err) {
      setError(err.message)
    }
  }

  const connectWalletHandler = async () => {
    /* check if MetaMask is installed */
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          /* request wallet connect */
          await window.ethereum.request({ method: "eth_requestAccounts" })
          /* create web3 instance and set to state var */
          const web3 = new Web3(window.ethereum)
          /* set web3 instance */
          setWeb3(web3)
          /* get list of accounts */
          const accounts = await web3.eth.getAccounts()
          /* set Account 1 to React state var */
          setAddress(accounts[0])
          

          /* create local contract copy */
          const fm = FakeContract(web3)
          setFakeContract(fm)
        } catch(err) {
          setError(err.message)
        }
    } else {
        // meta mask is not installed
        console.log("Please install MetaMask")
    }
  }

  return (
      <div className={styles.main}>
        <Head>
          <title>FaceMask!</title>
          <meta name="description" content="A blockchain authentication app" />
        </Head>
        <nav className="navbar mt-4 mb-4">
          <div className="container">
              <div className="navbar-brand">
                <h1>FaceMask! Authentication</h1>
              </div>
              <div className="navbar-end">
                  <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
              </div>
          </div>
        </nav>
          <section className="mt-5">
              <div className="container">
                <div className="field">
                  <div className="control">
                    <input className="input" type="type" placeholder="Enter order id" />
                  </div>
                  <button 
                    onClick={searchProduct} 
                    className="button is-primary mt-2"
                  >Check</button>
                </div>
              </div>
          </section>
        <section>
            <div className="container">
                <h2>FaceMask! inventory: {inventory}</h2>
            </div>
        </section>
        <section>
            <div className="container">
                <h2>Available FaceMask!s: {myFaceMaskCount}</h2>
            </div>
        </section>
        <section className="mt-5">
            <div className="container">
              <div className="field">
                <label className="label">Buy FaceMasks</label>
                <div className="control">
                  <input onChange={updateFaceMaskQty} className="input" type="type" placeholder="Enter amount..." />
                </div>
                <button 
                  onClick={buyFaceMaskHandler} 
                  className="button is-primary mt-2"
                >Buy</button>
              </div>
            </div>
        </section>
        <section>
            <div className="container has-text-danger">
                <p>{error}</p>
            </div>
        </section>
        <section>
            <div className="container has-text-success">
                <p>{successMsg}</p>
            </div>
        </section>
        <section>
            <div className="container">
                <h2>Transaction Customer: {memberAcc}</h2>
            </div>
        </section>
      </div>
  )
}

export default Fake