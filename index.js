const fs = require('fs')
const colors = require('colors')
const { firefox, chromium } = require('playwright')
const crypto = require('crypto')
const cluster = require('cluster')
const axios = require('axios')
const prompt = require('prompt-sync')({ sigint: true })
const { createCursor } = require('ghost-cursor-playwright')

process.on('uncaughtException', (err) => { })
process.on('unhandledRejection', (err) => { })

var proxies = false

try {
    proxies = fs.readFileSync('proxies.txt', 'utf-8').split('\n')
} catch (error) {}

var hrtime = process.hrtime()

var intro = 
`
 ╔╦╗┬─┐┬┌─┐  ╔═╗┌─┐┌┐┌┌─┐┬─┐┌─┐┌┬┐┌─┐┬─┐ F*ck D*sc0rd
  ║║├┬┘│├─┘  ║ ╦├┤ │││├┤ ├┬┘├─┤ │ │ │├┬┘ V1.1 
 ═╩╝┴└─┴┴    ╚═╝└─┘┘└┘└─┘┴└─┴ ┴ ┴ └─┘┴└─
`

var total = 0
var generated = 0
var locked = 0
var failed = 0

var use_proxies = false

function get_title() {
    return `DRIP - Generator | Total: ${total} | Generated: ${generated} | Locked: ${locked} | Failed: ${failed} | Lock-Rate: ${calc_lock_rate()}% | Fail-Rate: ${calc_fail_rate()}% | Tokens per min: ${calc_tokens_per_min()}`
}

;(async () => {
    if(cluster.isMaster) {
        var threads = 1
        process.title = get_title()
        console.clear()
        console.log(intro.brightGreen)
        console.log(' ~ '.green + 'dart owns cord' + '\n')
        if(proxies !== false) {
            if(proxies[0] != '') {
                use_proxies = true
                threads = ask_for_threads()
            } else {
                console.log(`${' [!]'.yellow} ${'No proxies found. Generating proxyless'.white}`)
                threads = 1
            }
        } else {
            console.log(`${' [!]'.yellow} ${'No proxies.txt file found. Generating proxyless'.white}`)
            threads = 1
        }
        start_time = Date.now()
        for (var i = 0; i < threads; i++) {
            cluster.fork()
        }
        cluster.on('message', (worker, msg, handle) => {
            total++
            if (msg.oneTokenGenerated) {
                generated++
            } else if(msg.oneTokenFailed) {
                failed++
            } else if(msg.oneTokenLocked) {
                locked++
            }
            process.title = get_title()
        })
    } else {
        while(true) {
            await generate_token()
        }
    }
    
})()

async function generate_token() {

    try {
        var config = ''
        var rate_limit = false
        var start_time = Date.now()
        var password = 'Dr1pDro0p$'
        var username = crypto.randomBytes(6).toString('hex') + ' | Drip Generator'
        var email = crypto.randomBytes(6).toString('hex') + '@sidcool.com'
        if(proxies[0] != '' && proxies != false) {
            var proxy = proxies[Math.floor(Math.random() * proxies.length)]
            console_log(`Using: ${proxy}`)
            if(proxy.includes('@')) {
                var address = proxy.split('@')[1]
                var auth = proxy.split('@')[0]
                config = { headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'], proxy: {server: 'http://' + address, username: auth.split(':')[0], password: auth.split(':')[1]} }
            } else {
                config = { headless: false,  args: ['--lang-en-US', '--no-sandbox', '--disable-setuid-sandbox'], proxy: {server: 'http://' + proxy} }
            }
        } else {
            config = { headless: true }
            rate_limit = true
        }
        var browser = await firefox.launch(config)
        var context = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4889.0 Safari/537.36' })
        var page = await context.newPage()
        const cursor = await createCursor(page)
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' })
        await page.goto('https://discord.com/')
        await page.click('button[class="button-ZGMevK buttonDark-3a8taR buttonLarge-3z9xOS gtm-click-class-open-button marginTop24-3ZXBpg"]')
        await sleep(200)
        try {
            await page.$eval('input[type*=checkbox]', el => el.click())            
        } catch (error) {}
        await page.type('input[class="username-1XgXmI"]', username + '\n')
        await solve_captcha(page, cursor)
        await page.waitForSelector('div[class="focusLock-2tveLW"]')
        if(await page.evaluate(function() {return document.body.textContent.includes("Start Verification")})) {
            console_log('Token locked, ip flagged ?'.red)
            process.send({ oneTokenLocked: 'request' })
            browser.close()
            if(rate_limit) {
                console_log('Wait for ratelimit')
                await sleep(start_time + 150000 - Date.now())
            }
            return
        }
        start_time = Date.now()
        await page.type('#react-select-2-input', 'January\n')
        await page.type('#react-select-3-input', '3\n')
        await page.type('#react-select-4-input', '2000\n\n')
        var close = 'button[class="closeButton-3nyHNb close-1mLglB button-f2h6uQ lookBlank-21BCro colorBrand-I6CyqQ grow-2sR_-F"]'
        await page.waitForSelector(close)
        await page.click(close)
        await page.waitForSelector("xpath=//input[@name='']")    
        await page.type('xpath=//input[@name=""]', email)
        await page.type('xpath=(//input[@name=""])[2]', password + '\n')
        var gotmail = false
        while(!gotmail) {
            mailresp = await axios.get('http://45.10.24.74/getToken=' + email)
            if(mailresp.data != 'There are currently no active Emails on this account.') {
                await page.goto('https://click.discord.com/ls/click?upn=' + mailresp.data, {waitUntil: 'load', timeout: 15000})
                gotmail = true
            }
            await sleep(300)
        }
        var token = await page.evaluate(function() {
            return (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
        })
        console_log(`Generated: ${token}`.green)
        fs.appendFileSync('tokens.txt', email + ':' + password + ':' + token + '\n')
        process.send({ oneTokenGenerated: 'request' })
        await browser.close()
        if(rate_limit) {
            console_log('Wait for ratelimit')
            await sleep(start_time + 150000 - Date.now())
        }
    } catch (error) {
        process.send({ oneTokenFailed: 'request' })
        console_log('Token creation failed: ' + error.toString().split('\n=')[0])
        //console.log(error)
        await browser.close()
    }

}

function console_log(text) {

    const prtime = process.hrtime(hrtime)
    const time = (prtime[0]* 1000000000 + prtime[1]) / 1000000000
    const log_time = time.toString().split('.')[0] + '.' + time.toString().split('.')[1].split('')[0] + time.toString().split('.')[1].split('')[1]

    console.log(` [thread#${cluster.worker.id} ~ ${log_time}] `.green + `${text}`)
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function solve_captcha(page, cursor) {
    await page.waitForSelector('iframe')
    var frame = page.mainFrame().childFrames()[0]
    var frame_loaded = false
    while(!frame_loaded) {
        try {
            var content = await frame.content()
            if(content.includes('<div class="challenge-container">')) {
                frame_loaded = true
                await sleep(300)
                await page.click('iframe')
                await frame.waitForSelector('.task-image .image')
                const text = await frame.$eval('div[class=prompt-text]', element => element.textContent)
                var text_array = text.split(' ')
                var search = text_array[text_array.length - 1]
                if(search.includes('right')) {
                    search = 'right'
                } else if(search.includes('left')) {
                    search = 'left'
                } else if(search.includes('vertical')) {
                    search = 'vertical'
                }
                elHandleArray = await frame.$$('.task-image .image')
                if (elHandleArray.length > 0) {
                    imagesSelected = []
                    for (var i = 0; i < 9; i++) {
                        var urlString = await frame.evaluate(el => getComputedStyle(el).backgroundImage, elHandleArray[i])
                        var imageUrl = get_url_from_string(urlString)
                        result = await get_image_contain(imageUrl, search)
                        if(result) {
                            var cords = {
                                x: 615.4000244140625,
                                y: 422.70001220703125,
                                width: 315.23333740234375,
                                height: 56
                            }
                            cursor.actions.move(cords)
                            elHandleArray[i].click()
                            imagesSelected.push((i+1).toString())
                        }
                    }
                } else {
                    console_log('Error solving captcha: ERR1'.red)
                }
                await sleep(200)
                await frame.click('div[class="button-submit button"]')
                if(imagesSelected.length != 0) {
                    console_log(`Captcha bypassed! (${imagesSelected.join(' ')})`)
                } else {
                    console_log('Error solving captcha: ERR2')
                }        
            } else if(content.includes('https://adservice.google.com')) {
                frame = page.mainFrame().childFrames()[1]
            } else {
                await sleep(200)
            }
        } catch (error) {
            await sleep(200)
        }
    }
}

async function get_image_contain(url, search) {
    const reponse = await axios.post("http://152.89.239.17:26000/predict", {"body":"imageUrl=" + url + "|wordToFind="+search.toString()})
    if(reponse.data == "1") {
        return true
    } else {
        return false
    }
}

function get_url_from_string(urlString) {
    var imageUrl = urlString.substring(urlString.indexOf('"') + 1, urlString.lastIndexOf('"'))
    if(!imageUrl || !imageUrl.includes('https')) {
        return 0
    }
    return imageUrl
}

function calc_lock_rate() {
    return Math.round((100 * locked) / total)
}

function calc_fail_rate() {
    return Math.round((100 * failed) / total)
}

function calc_tokens_per_min() {
    const prtime = process.hrtime(hrtime)
    const time = (prtime[0]* 1000000000 + prtime[1]) / 1000000000
    return Math.round(generated / (time / 60))
}

function ask_for_threads() {
    var threads = parseInt(prompt(' [?] '.green + 'Enter thread amount: '))
    if(isNaN(threads)) {
        console.log(`${' [!]'.yellow} ${'Please type integer'.white}`)
        return ask_for_threads()
    } else {
        return threads
    }
}