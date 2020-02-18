let store = {
    currentTab: 'spirit',
    roverInfo: {},
    roverImages: [],
}

// add our markup to the page
const root = document.getElementById('root');
const tabs= document.querySelectorAll('.tab');

const updateStore = (store, newState) => {
    console.log("Updating the store-",newState);
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { roverInfo, roverImages } = state

    return `
        <div>
            <div class="info-container">
                ${renderInfo(roverInfo)}
            </div>
            <section class="image-container">
                ${renderImages(roverImages)}
            </section>
        </div>
    `
}

const fetchData= async (store,currentTab)=>{
    await getRoverData(store,currentTab);
    await getRoverImages(store,currentTab);
}
// listening for load event because page should load before any JS is called
window.addEventListener('load', async () => {
    console.log("Window loaded-");
    init(tabs,store);
    await fetchData(store,store.currentTab);
    render(root, store);
})

const init = async (tabs,store)=>{
    tabs.forEach(tab => {
        tab.addEventListener('click',async e => {
            const currentTab=e.target.id;
            await updateStore(store,{currentTab: currentTab});
            activeTab(tabs,currentTab);
            fetchData(store,currentTab);
        })
    });
}

const activeTab = (tabs,currentTab)=>{
    tabs.forEach(tab=>{
        if(tab.id ===currentTab){
            tab.classList.add('active')
        }else{
            tab.classList.remove('active')
        }
    })
}

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information --
const renderInfo = (info) => {
    return `
        <figure>
            <img src="${info.imageUrl}" alt="${info.name}" class="main-rover-img"/>
            <figcaption>An image of ${info.name} rover</figcaption>
        </figure>

        <div class="info">
            <strong>About</strong>
            <p>${info.about}</p>

            <strong>Launch Date</strong>
            <p>${info.launchDate}</p>

            <strong>Landing Date</strong>
            <p>${info.landingDate}</p>

            <strong>Max Speed</strong>
            <p>${info.maxSpeed}</p>

            <strong>Cost</strong>
            <p>${info.cost}</p>

            <strong>Distance covered</strong>
            <p>${info.distanceCovered}</p>
        </div>
    `
}

// A pure function that renders images requested from the backend
const renderImages = (images) => {
    return images.map(image => {
        return (`
            <div class="image-card">
                <img src="${image.img_src}" />

            </div>
        `)
    })
}

// ------------------------------------------------------  API CALLS

const getRoverData = (store,roverName) => {
    console.log("Fetching rover data-");
    fetch(`http://localhost:3000/roverInfo`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then(res => res.json())
        .then(roverInfo => updateStore(store, { roverInfo: roverInfo }))
}

const getRoverImages = (store,roverName) => {
    console.log("Fetching rover images-");
    fetch(`http://localhost:3000/fetchImage`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({roverName:roverName})
    })
        .then(res => res.json())
        .then(roverImages => updateStore(store, { roverImages: roverImages }))
}