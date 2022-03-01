import {fetchOrcaData, fetchRaydiumData, fetchSerumDexData, fetchPrice, printResponse} from './coingecko'


let response = fetchPrice()
response.then(function(result) {
    console.log(result)
})


// exchange information

let orcaresp = fetchOrcaData()
// let serumresp = fetchSerumDexData()
// let raydiumresp = fetchRaydiumData()

orcaresp.then(function(result) {
    printResponse(result)
})

// serumresp.then(function(result) {
//     printResponse(result)
// })

// raydiumresp.then(function(result) {
//     printResponse(result)
// })

