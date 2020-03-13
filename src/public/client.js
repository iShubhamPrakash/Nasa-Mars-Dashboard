let store = {
    currentTab: 'curiosity',
    roverInfo: {},
    roverImages: [],
}

// add our markup to the page
const root = document.getElementById('root');
const tabs= document.querySelectorAll('.tab');

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state, renderInfo, renderImages)
}


// App() is a higher order function-
const App = (state, renderInfo, renderImages) => {
    const { roverInfo, roverImages } = state

    return generateHTML(roverInfo, roverImages, renderInfo, renderImages);
}

// generateHTML() is a higher order function-
const generateHTML = (roverInfo, roverImages,generateInfo,generateImage) => {
    const infoHTML= generateInfo(roverInfo);
    const imageHTML= generateImage(roverImages);
    return `
        <div>
            <div class="info-container">
                ${infoHTML}
            </div>
            <section class="image-container">
                ${imageHTML}
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
    init(tabs,store);
    await fetchData(store,"curiosity");
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
            <br/>
            <strong>Launch Date</strong>
            <p>${info.launchDate}</p>
            <br/>
            <strong>Landing Date</strong>
            <p>${info.landingDate}</p>
            <br/>
            <strong>Max Speed</strong>
            <p>${info.maxSpeed}</p>
            <br/>
            <strong>Cost</strong>
            <p>${info.cost}</p>
            <br/>
            <strong>Distance covered</strong>
            <p>${info.distanceCovered}</p>
        </div>
    `
}

// A pure function that renders images requested from the backend
const renderImages = (images) => {
    let imageHTML=``;

    // here map() is also a higher order function
    images.slice(0,6).map(image => {
        imageHTML+=`
                    <figure class="image-card">
                        <img src="${image.img_src}" alt="Rover image" class="rover-image"/>
                        <figcaption>
                            <span><b>Sol (Mars days):</b> ${image.sol}</span><br/>
                            <span><b>Earth date:</b> ${image.earth_date}</span>
                        </figcaption>
                    </figure>`
    })
    return imageHTML;
}

// ------------------------------------------------------  API CALLS

const getRoverData = (store,roverName) => {
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