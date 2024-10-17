// npm
import fuzzysort from "fuzzysort"
import { createSignal, onMount } from "solid-js"
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import 'leaflet.markercluster'

// self
import markerIcon from "!root/node_modules/leaflet/dist/images/marker-icon.png"
import data from "!root/les-fleurons.json"

const regions = [...new Set(data.map((x) => x.region))]

let fleuronsRef: any
let selectRef: any
let inputRef: any
let map: any
const center: any = [53, -73.5]
function LeafletMap() {
  let mapRef: HTMLDivElement | undefined = undefined

  L.Marker.prototype.setIcon(L.icon({
    iconUrl:markerIcon.src
  }))

  onMount(() => {
    if (!mapRef) return
    map = L.map(mapRef).setView(center, 4)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  })

  const [r, rr] = createSignal([])

  function results() {
    return r().filter(Boolean)
  }

  function change(ev: any) {
    // @ts-expect-error
    rr(fuzzysort.go(ev.target.value, data, { key: "name", limit: 5}))
  }

  function pick(a: any) {
    // @ts-expect-error
    rr([a])
    inputRef.value = a.target
    const coords: any = [a.obj.longitude, a.obj.latitude]
    L.marker(coords).addTo(map)
      .bindPopup(`${a.obj.name} (${a.obj.region}) ${a.obj.score} fleurons`)
      .openPopup()
    map.setView(coords, 7);
  }

  function resetResults() {
    rr([])
    inputRef.value = ""
    selectRef.value = "Région?"
    fleuronsRef.value = "Choisir le nombre de fleurons"
    inputRef.focus()
    map.setView(center, 4)
  }

  function pickRegion(a: any) {
    if (!a.target.value) return
    // @ts-expect-error
    rr(data.filter((x) => x.region === a.target.value).map((x) => ({ target: x.name, obj: x})))
  }

  function pickFleurons(a: any) {
    if (!a.target.value) return
    // @ts-expect-error
    rr(data.filter((x) => x.score === parseInt(a.target.value)).map((x) => ({ target: x.name, obj: x})))
  }

  return (
    <div>
      <h1>Leaflet Map</h1>
      <div class="flex space-x-10">
        <select ref={fleuronsRef} on:change={pickFleurons}>
          <option>Choisir le nombre de fleurons</option>
          <option value={1}>1 fleuron</option>
          <option value={2}>2 fleurons</option>
          <option value={3}>3 fleurons</option>
          <option value={4}>4 fleurons</option>
          <option value={5}>5 fleurons</option>
        </select>
        <select ref={selectRef} on:change={pickRegion}>
          <option>Région?</option>
          {regions.map((x) => (
          <option>{x}</option>
          ))}
        </select>
        <input placeholder="Chercher" ref={inputRef} onKeyUp={change} type="text" />
      </div>
      <div>Search and results</div>
        {results().map((x: any, i: any) => (
          <button on:click={[pick, x]} classList={{btn: true, "btn-primary": Boolean(i), "btn-accent": !i}}>{x.target}</button>
        ))}
      {results().length > 0 && <button on:click={resetResults} class="btn btn-error">Reset</button>}
      <div class="grid grid-cols-2 gap-4">
        <div ref={mapRef} style="height: 600px"></div>
        <div>
        {//@ts-expect-error
        results().length > 0 && <img style="height: 600px" class="object-fit" src={results()[0].obj.images[0]} alt="nope" />}
        </div>
        <div>
        {//@ts-expect-error
        results().length > 0 && <img style="height: 600px" class="object-fit" src={results()[0].obj.images[1]} alt="nope" />}
        </div>
        <div>
        {//@ts-expect-error
        results().length > 0 && <img style="height: 600px" class="object-fit" src={results()[0].obj.images[2]} alt="nope" />}
        </div>
      </div>
    </div>
  )
}

export default LeafletMap
