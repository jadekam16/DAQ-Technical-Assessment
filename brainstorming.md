# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware
N/A 

## Spyder
### Task #1: 
To install the nodemon packages, I first found the installation command in the nodemon docs and ran `npm install --save-dev nodemon` in the ui directory to install it as a dev dependency. 

Then, I edited the script in package.json to add nodemon in front of it e.g. `"start": "nodemon --exec next start"`. 

### Task #2: 
When attempting this task, the first step I did was to run `docker compose up` to see what kind of invalid values/data was being sent. I found that sometimes the temp was sent in a binary-encoded string rather than a number, and after a quick look at the code in the emulator, my thinking was this block of code was causing it:

```
battery_temperature: Math.random() < BINARY_PROBABILITY 
  ? Buffer.from(new Uint32Array([generated_value]).buffer).toString('binary')
  : generated_value,
```

Basically, when Math.random() < 0.2, the temperature is converted to binary e.g. 7\u0000\u0000\u0000. Don't think this is ideal because we want numbers. I found that the data was sent to the frontend in server.ts so I should put my check there.

To handle this invalid data, there's a couple options I could pick from, for example, simply filtering out the data or converting the binary strings back into numbers.

I went for simply filtering out non-numeric data so that we can ensure that the frontend only receives valid data + it can handle a lot of unexpected data types and not just invalid binary strings which I felt was better in the long term. 

Some trade-offs, we do lose a bit of the data (~20%) which is not great. 

Coding-wise, my solution was pretty simple - just check battery temperature is a valid number, if it is then send the data to the frontend, if not then log an error msg and it doesn't get sent to the frontend.

### Task #3:
Like the hint said, there were a couple options I could choose to implement this task namely: using cn() or inline style prop.

Evaluating all these options:
- cn() = styling logic is separated from rendering logic, my colour classes can be reused elsewhere and not just in the file, no dynamic style object created on each render which improves performance.
- inline style prop: good for component-specific styling that won't be reused, if I want styles completed scoped to this component, or when i need some complex dynamic styling thats difficult to do with class names.

In the end, I picked cn() in case I do wanna use my styling (colour classes) outside of this file, and I found the current implementation more clean and readable. If in the future, I wanted to add some gradients etc. maybe I would consider switching it to inline styling. Both options were not bad here, but I picked the one I felt was better for this scenario :) 

### Task #4:
Seeing the question - the first place I thought of to check for bugs was in page.tsx, because that's where the button is being set. 

```
 useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service")
        setConnectionStatus("Connected")
        break
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service")
        setConnectionStatus("Disconnected")
        break
      case ReadyState.CONNECTING:
        setConnectionStatus("Connecting")
        break
      default:
        setConnectionStatus("Disconnected")
        break
    }
  }, [])
```

Could immediately see the problem here. It's because the hook here has an empty dependency array so it means it only runs once when the component mounts, so it doesn't really react to changes to readyState. To fix the problem, I tried adding readyState to the dependency array, and it worked yay! The button now updated the connection status accordingly :) 

### Task #5: 
So, I wasn't really sure what features to add as I don't know what is typically useful on something like this so I went with somewhat generic stuff that would (likely) be useful. Some ideas were:
- Toast notifications for Task 4 errors. make a notification button that opens up a popup that shows notifs?
- Light / Dark Mode toggle button 
- chart to display temp data.
- moveable widgets
- notetaking panel

#### Final Features:

#### Feature #1: 
A Chart! My thinking was it's always better to visualise data especially when it's coming in every 500ms! So, I made a nice line chart where you can visualise real-time data (battery temps) as they come in! I used the shadcn chart component which was very handy - I don't typically use shadcn so this was a learning exp for me too! Consulting this doc: https://ui.shadcn.com/charts#line-chart was very useful for me as it basically taught me everything I needed to know and I just customised it a bit :D In terms of how I got the data on there, this block of code probably explains it: 

```
const [temperatureData, setTemperatureData] = useState<TemperatureDataPoint[]>([])

useEffect(() => {
    console.log("Received: ", lastJsonMessage)
    if (lastJsonMessage === null) {
      return
    }
    
    const data = lastJsonMessage as VehicleData
    setTemperature(data.battery_temperature)

    // Add to temperature history (for chart display)
    setTemperatureData(prevData => {
      const newDataPoint = {
        temperature: data.battery_temperature,
        timestamp: data.timestamp,
      }
      
      // Keep only the latest MAX_DATA_POINTS readings
      const updatedData = [...prevData, newDataPoint]
      if (updatedData.length > MAX_DATA_POINTS) {
        return updatedData.slice(-MAX_DATA_POINTS)
      }
      return updatedData
    })
  }, [lastJsonMessage])
```

In the above, added some logic in `data-wrapper.tsx` to store the temperature data to use for my chart, note: I only included the last 50 readings to be used in the chart (MAX_DATA_POINTS). 

Then using this function in `data-wrapper.tsx`:
```
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
``` 

I used it to retrieve the data so I could pass it down to the `TemperatureChartWidget` in `dashboard-layout.tsx`
```
const { layouts, layoutKey, saveLayout, temperatureData } = useData()

  const widgets = {
    "temperature-chart": <TemperatureChartWidget data={temperatureData} />,
    "live-temperature": <LiveTemperatureWidget />,
    "panel-1": <EmptyPanelWidget title="Available Panel" />,
    "panel-2": <EmptyPanelWidget title="Available Panel" />
  }
```

In my temperature chart widget, data was passed as a prop to use here:
```
<CardContent className="p-2">
  <TemperatureChart data={data} />
</CardContent>
``` 

Then in my actual temperature chart file `temperature-chart.tsx` - that data is passed as a prop and used to make the line chart :) Hope that makes sense, sorry for the long explanation ;-;

#### Feature #2: 
I made some widgets yippee! Thought it'd be cool if everything was made into widgets so you can customise it however you like! You can move the widgets around and re-arrange your dashboard -> drag and droppable + there's also a 'reset layout' button in case you don't like your config (I was playing around with it too much then it was a pain to reset to the original layout so I made a button for it instead!)

As for the explanation, I'll give a quick overview:
1. For each widget type, I created a new component file e.g. `temperature-chart.widget.tsx`, `live-temperature-widget.tsx`. 
2. Then, for each widget, it was added to the widget config in `dashboard-layout.tsx`:

```
const widgets = {
  "temperature-chart": <TemperatureChartWidget data={temperatureData} />,
  "live-temperature": <LiveTemperatureWidget />,
  "panel-1": <EmptyPanelWidget title="Available Panel" />,
  "panel-2": <EmptyPanelWidget title="Available Panel" />
}
```

3. Then, add it to the default layout (will be useful when we implement the reset layout button!):
```
const defaultLayouts = {
    lg: [
      { i: "temperature-chart", x: 0, y: 0, w: 8, h: 8 },
      { i: "live-temperature", x: 8, y: 0, w: 4, h: 8 },
      { i: "panel-1", x: 0, y: 8, w: 6, h: 6 },
      { i: "panel-2", x: 6, y: 8, w: 6, h: 6 }
    ],
    ....
``` 

4. Then, the core drag-and-drop functionality (in `dashboard-layout.tsx`), it was implemented like so:

```
<ResponsiveGridLayout
  key={layoutKey}
  className="layout"
  layouts={layouts}
  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
  cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
  rowHeight={40}
  isResizable={true}
  isDraggable={true}
  onLayoutChange={(currentLayout, allLayouts) => saveLayout(currentLayout, allLayouts)}
  draggableHandle=".cursor-move"
>
  {Object.keys(widgets).map(key => (
    <div key={key}>
      {widgets[key as keyof typeof widgets]}
    </div>
  ))}
</ResponsiveGridLayout>
```

- I added a layout key cos I was getting a hydration error (occurs if the server and client render different content), it ensured proper rendering of the grid layout component specifically when layout changes happen, which avoids partial rendering issues :) 
- Layouts: the layouts object contains positioning information for each screen size (so it's responsive~) 
- isResizable={true}, isDraggable={true} makes it so users can interact with widget (resize, move etc.)
- when `onLayoutChange` event fires, my `saveLayout` function stores this new arrangement in localStorage and `key={layoutKey}`forces a complete re-render when the layout is reset. All this logic is in `data-wrapper.tsx` :D 

#### Feature #3: 

Light mode and dark mode! Press the little button on the top right to toggle dark/light mode! 
- Easiest feature to implement out of the 3 (phew!)

Basically, just added this logic in to toggle the theme (and change logo):

```
const toggleTheme = () => {
  setTheme(theme === "dark" ? "light" : "dark")
}

....

{theme === "dark" ? (
  <Image
    src={RedbackLogoDarkMode}
    className="h-12 w-auto"
    alt="Redback Racing Logo"
  />
) : (
  <Image
    src={RedbackLogoLightMode}
    className="h-12 w-auto"
    alt="Redback Racing Logo"
  />
)}
```

Then, just used a button:
```
<TooltipButton
  tooltip="Toggle between light and dark mode"
  onClick={toggleTheme}
  icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
  label={theme === "dark" ? "Light Mode" : "Dark Mode"}
/>
```

### Task #6: 
Last Task! :D 

So, my thought was... if I was meant to separate the websocket code from page.tsx... I might as well refactor the code while I'm at it to make everything cleaner! So, the first thing I did actually was to separate everything into their own respective components (as you probably inferred from my previous explanations). So, I really just gave everything their own files i.e., widgets, charts, tooltip button - mostly copying and pasting code around to be honest since it was already all implemented :)

Now, onto the actual `data-wrapper.tsx` file. Full disclosure, I wasn't super familiar about using createContext/useContext ;-; so there was a lot of doc reading involved and I hope I did this task correctly but here's what I did:

1. First thing I did was just to copy over all the code that handled the storage/acquisition of data. 
2. Created context: `const DataContext = createContext<DataContextType | undefined>(undefined)` 
3. Hook to use context: 

```
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
```
4. In page.tsx, wrap everything around dataProvider: (EDIT THIS LATER)
```
export default function Page(): JSX.Element {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}
```

5. For all components that wanna use it, just use useData() to extract info out e.g. `const { layouts, layoutKey, saveLayout, temperatureData } = useData()` 

and that's it! 

## Cloud
N/A