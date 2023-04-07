/*
 * @Author: wangcy
 * @Date: 2023-04-07 11:40:43
 * @Description: 
 */
/**
 * @author: wangcy
 * @description: 解析歌词字符串
 * {time: 时间, name:歌词}
 */
function parseLrc () {
    let arr = [] // 歌词数组
    let lines = lrc.split('\n') // 当前歌词
    let line; // 每一行的歌词
    for (let i = 1; i < lines.length; i++) {
        line = lines[i]
        let parts = line.split(']')
        let timeStr = parts[0].substring(1)
        let obj = {
            time: time2number(timeStr),
            name: parts[1]
        }
        arr.push(obj)
    }
    return arr
}
/**
 * @author: wangcy
 * @description: 时间转字符串
 */
function time2number (str) {
    let parts = str.split(':')
    let minutes = parts[0] * 60
    let seconds = parts[1]
    return minutes + +seconds
}
let lrcData = parseLrc()
// 获取dom元素
let doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('ul'),
    container: document.querySelector('.container')
}
/**
 * @author: wangcy
 * @description: 计算在lrcData中 应该显示的高亮歌词下标 需要知道当前播放器播放到第几秒钟
 */
function findIndex () {
    let currentTime = doms.audio.currentTime // 当前播放时间
    for (let i = 0; i < lrcData.length; i++) {
        if (currentTime < lrcData[i].time) {
            return i - 1
        }
    }
    return lrcData.length - 1
}
/**
 * @author: wangcy
 * @description: 创建歌词列表元素
 */
function createList () {
    for (let i = 0; i < lrcData.length; i++) {
        let li = document.createElement('li')
        li.textContent = lrcData[i].name
        doms.ul.appendChild(li)
    }
    // 优化  数据庞大的情况下  可以先将创建好的li添加到片段中
    // let frag = document.createDocumentFragment()
    // for(let i = 0; i < lrcData.length; i++) {
    //     let li = document.createElement('li')
    //     li.textContent = lrcData[i].name
    //     frag.appendChild(li)
    // }
    // doms.ul.appendChild(frag)
}
createList()

/**
 * @author: wangcy
 * @description: 设置ul的偏移量
 */
let containerHeight = doms.container.clientHeight // 容器高度
let liHeight = doms.ul.children[0].clientHeight // li高度
let maxHeight = doms.ul.clientHeight - containerHeight // 最大高度
function setOffset () {
    let index = findIndex()
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2
    if (offset < 0) { //如果当前还没有开始播放
        offset = 0
    }
    if (offset > maxHeight) { // 当前歌词位置在最后一句
        offset = maxHeight
    }
    doms.ul.style.transform = `translateY(-${offset}px)`
    // doms.ul.children[index].classList = 'active'
    // 去掉之前的active
    let active = doms.ul.querySelector('.active')
    if (active) {
        active.classList.remove('active')
    }
    let li = doms.ul.children[index]
    if (li) {
        li.classList.add('active')
    }
}
doms.audio.addEventListener('timeupdate',setOffset)