// const request = require('supertest')
// const express = require('express')
const { expect } = require("chai")
const scriptjs = require("../src/script")

// const app = new express()
// app.use('/', router)

// describe('Behavior of Post test', () => {
//     test('Should return ok..', async() => {       

//         const res = await request(app).post('/').send({"data": "whatname"})
//         expect(res.statusCode).toBe(200)
        
//     })
// })


test('Testing file download', () => {
    expect(scriptjs.dowloadFile()).to.be.equal(true)
})


describe('Behavior of readFromDownloadedFile function', () => {
    test('Testing readFromDownloadedFile with EUR', () => {
        expect(scriptjs.readFromDownloadedFile("EUR", './tests/downloadedFile.txt')).to.deep.equal([ '25.04.2022', '24,420' ])
    })
    test('Testing readFromDownloadedFile with eur', () => {
        expect(scriptjs.readFromDownloadedFile("eur", './tests/downloadedFile.txt')).to.deep.equal(["nothing"])
    })
    test('Testing readFromDownloadedFile with nothing', () => {
        expect(scriptjs.readFromDownloadedFile("", './tests/downloadedFile.txt')).to.deep.equal(["nothing"])
    })
})


describe('Behavior of parseFileData function', () => {
    var fileInput1 = "25.04.2022 #79\nzemě|měna|množství|kód|kurz\nAustrálie|dolar|1|AUD|16,310\n"
    var fileInput2 = "25.04.2022 #79\nzemě|měna|množství|kód|kurz\n"
    var fileInput3 = ""
    
    var expectedArray = [
        '25.04.2022',
        [
          [ 'Austrálie', 'dolar', '1', 'AUD', '16,310' ]
        ]
      ]
      var expectedArray2 = [
        '25.04.2022',
        [
        ]
      ]
      var expectedArray3 = ['', []]

    test('Testing parseFileData one row', () => {
        expect(scriptjs.parseFileData(fileInput1)).to.deep.equal(expectedArray)
    })
    test('Testing parseFileData only header', () => {
        expect(scriptjs.parseFileData(fileInput2)).to.deep.equal(expectedArray2)
    })
    test('Testing parseFileData empty', () => {
        expect(scriptjs.parseFileData(fileInput3)).to.deep.equal(expectedArray3)
    })
})


describe('Behavior of readFromHistFile function', () => {
    var expectedDataSet = "24.04.2022|EUR|24,320\r\n\
25.04.2022|EUR|24,420\r\n"

    test('Testing readFromHistFile', () => {
        expect(scriptjs.readFromHistFile('./tests/history.txt')).to.deep.equal(expectedDataSet)
    })
})


describe('Behavior of parseHistFileData function', () => {
    var inputDataSet = "24.04.2022|EUR|24,320\r\n\
25.04.2022|EUR|24,420\r\n"
    var expectedDataSet = [
        [ '24.04.2022', 'EUR', '24,320' ],
        [ '25.04.2022', 'EUR', '24,420' ]
      ]
    test('Testing parseHistFileData', () => {
        expect(scriptjs.parseHistFileData(inputDataSet)).to.deep.equal(expectedDataSet)
    })
    test('Testing parseHistFileData', () => {
        expect(scriptjs.parseHistFileData("")).to.deep.equal([])
    })
})

describe('Behavior of writeToFile function', () => {
    test('Testing writeToFile processing to string', () => {
        expect(scriptjs.writeToFile(["24.04.2022", "EUR" ,"24,320"], './tests/writing.txt')).to.deep.equal("24.04.2022|EUR|24,320\r\n")
    })
})


describe('Behavior of processMessage function', () => {
    test('Testing processMessage with whatname', () => {
        expect(scriptjs.processMessage("whatname")).to.deep.equal("My name is Bot007")
    })
    test('Testing processMessage with neco', () => {
        expect(scriptjs.processMessage("neco")).to.deep.equal("Not supported")
    })
    test('Testing processMessage with whattime', () => {
        expect(scriptjs.processMessage("whattime")).to.be.a('number')
    })
    test('Testing processMessage with whatcourseeur', () => {
        expect(scriptjs.processMessage("whatcourseeur")).to.be.a('string')
    })
    test('Testing processMessage with whathistoryeur', () => {
        expect(scriptjs.processMessage("whathistoryeur")).to.be.an('array')
    })
    test('Testing processMessage with help', () => {
        expect(scriptjs.processMessage("help")).to.be.equal("Available commands: what name, what time, what course EUR, what history EUR and help")
    })
})