const getData = async (url) => {

    return await fetch(url)
        .then(res => res.json())
}

const fillArray = (data, array) => {

    data.forEach(d => {
        array.push(d.content.id)

        d.replies?.forEach(r => {
            array.push(r.content.id)
        })
    })
}