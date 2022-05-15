const { expect } = require("chai")
const scriptjs = require("../src/utils/functions")
var os = require('os')


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
    test('Testing readFromDownloadedFile with wrong path', () => {
        expect(scriptjs.readFromDownloadedFile("", './tests/downloadedFilee.txt')).to.deep.equal(["bad file"])
    })
    test('Testing readFromDownloadedFile with wrong path', () => {
        expect(scriptjs.readFromDownloadedFile("EUR", './tests/downloadedFilee.txt')).to.deep.equal(["bad file"])
    })
    test('Testing readFromDownloadedFile with wrong path', () => {
        expect(scriptjs.readFromDownloadedFile("eur", './tests/downloadedFilee.txt')).to.deep.equal(["bad file"])
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
    var endofLine = os.EOL
    var expectedDataSet = "24.04.2022|EUR|24,320"+endofLine+"25.04.2022|EUR|24,420"+endofLine

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
        expect(scriptjs.processMessage("whatname")).to.deep.equal(["My name is Bot007", "text"])
    })
    test('Testing processMessage with neco', () => {
        expect(scriptjs.processMessage("neco")).to.deep.equal(["Not supported", "text"])
    })
    test('Testing processMessage with whattime', () => {
        expect(scriptjs.processMessage("whattime")).to.be.an('array')
    })
    test('Testing processMessage with whatcourseeur', () => {
        expect(scriptjs.processMessage("whatcourseeur")).to.be.an('array')
    })
    test('Testing processMessage with whathistoryeur', () => {
        expect(scriptjs.processMessage("whathistoryeur")).to.be.an('array')
    })
    test('Testing processMessage with help', () => {
        expect(scriptjs.processMessage("help")).to.deep.equal(["Available commands: what name, what time, what course EUR, what history EUR and help", "text"])
    }) 
    test('Testing processMessage with shouldbuyeur', () => {
        expect(scriptjs.processMessage("shouldbuyeur")).to.be.an('array')
    })
})

describe('Behavior of getURL function', () => {
    var urlToTest = "https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date="

    test('Testing getURL', () => {
        expect(scriptjs.getURL(urlToTest, 2022, 3, 29)).to.be.equal("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date=29.03.2022")
    })
    test('Testing getURL', () => {
        expect(scriptjs.getURL(urlToTest, 2022, 10, 29)).to.be.equal("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date=29.10.2022")
    })
    test('Testing getURL', () => {
        expect(scriptjs.getURL(urlToTest, 2022, 3, 5)).to.be.equal("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date=05.03.2022")
    })
    test('Testing getURL', () => {
        expect(scriptjs.getURL(urlToTest, 2022, 11, 5)).to.be.equal("https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date=05.11.2022")
    })
})

describe('Behavior of createURL function', () => {
    var urlToTest = "https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt;jsessionid=5C6EEEF22D806ED9931DC1DA74C535DD?date="

    test('Testing createURL', () => {
        expect(scriptjs.createURL(urlToTest)).to.be.a('string')
    })
})

describe('Behavior of sumArray functin', () => {
    test('Testing sumArray, int', () => {
        expect(scriptjs.sumArray([1,2,3])).to.deep.equal(6)
    })
    test('Testing sumArray, float', () => {
        expect(scriptjs.sumArray([1.0,2.0,3.0])).to.deep.equal(6.0)
    })
})

describe('Behavior of average functin', () => {
    test('Testing average, int', () => {
        expect(scriptjs.average(6, 3)).to.deep.equal(2)
    })
    test('Testing average, float', () => {
        expect(scriptjs.average(6.0, 3)).to.deep.equal(2.0)
    })
})

describe('Behavior of tenPercent functin', () => {
    test('Testing tenPercent, int', () => {
        expect(scriptjs.tenPercent(24.55)).to.deep.equal(2.455)
    })
    test('Testing tenPercent, float', () => {
        expect(scriptjs.tenPercent(24)).to.deep.equal(2.4)
    })
})

describe('Behavior of returnDifference functin', () => {
    test('Testing returnDifference, is not too much, small, bigger', () => {
        expect(scriptjs.returnDifference(24.50, 25.60, 2.48)).to.deep.equal([true, -1.3799999999999986])
    })
    test('Testing returnDifference, is not too much, big, smaller ', () => {
        expect(scriptjs.returnDifference(25.60, 24.50, 2.48)).to.deep.equal([true, -1.3799999999999986])
    })
    test('Testing returnDifference, is too much, small, bigger ', () => {
        expect(scriptjs.returnDifference(24.50, 27.70, 2.55)).to.deep.equal([false, 0.6499999999999995])
    })
    test('Testing returnDifference, is too much, big, smaller ', () => {
        expect(scriptjs.returnDifference(27.70, 24.50, 2.55)).to.deep.equal([false, 0.6499999999999995])
    })
})


describe('Behavior of isLowering functin', () => {
    test('Testing isLowering, yes', () => {
        expect(scriptjs.isLowering([24.55, 24.45, 24.33])).to.deep.equal(true)
    })
    test('Testing isLowering, not', () => {
        expect(scriptjs.isLowering([24.56, 25.10, 25.60])).to.deep.equal(false)
    })
})


describe('Behavior of isLessThanTenPercent functin', () => {
    test('Testing isLessThanTenPercent, is not too much', () => {
        expect(scriptjs.isLessThanTenPercent([24.50, 25.60, 24.60])).to.deep.equal([true, 24.900000000000002, -1.3899999999999988])
    })
    test('Testing isLessThanTenPercent, is not too much', () => {
        expect(scriptjs.isLessThanTenPercent([24.30, 24.50, 27.70])).to.deep.equal([false, 25.5, 0.6499999999999995])
    })
})

describe('Behavior of checkIfBuy functin', () => {
    test('Testing checkIfBuy, lowering', () => {
        expect(scriptjs.checkIfBuy([['24.04.2022', 'EUR', '24.50'], 
        ['25.04.2022', 'EUR', '24.30'], ['26.04.2022', 'EUR', '24.10']])).to.be.a('string')
    })
    test('Testing checkIfBuy, not buy, more than 10%', () => {
        expect(scriptjs.checkIfBuy([['24.04.2022', 'EUR', '24.50'], 
        ['25.04.2022', 'EUR', '27.70'], ['26.04.2022', 'EUR', '24.10']])).to.be.a('string')
    })
    test('Testing checkIfBuy, not enough data', () => {
        expect(scriptjs.checkIfBuy([['24.04.2022', 'EUR', '24.50'], 
        ['25.04.2022', 'EUR', '27.70']])).to.be.equal("Can not recommend, not enough data")
    })
    test('Testing checkIfBuy, could buy, less than 10%', () => {
        expect(scriptjs.checkIfBuy([['24.04.2022', 'EUR', '24.50'], 
        ['25.04.2022', 'EUR', '24.60'], ['26.04.2022', 'EUR', '24.10']])).to.be.a('string')
    })
   

})


