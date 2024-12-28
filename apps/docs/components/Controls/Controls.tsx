import classes from './Controls.module.css'

export type Controls = {
  itemCount: number
  gap: number
  padding: number
  offScreenPages: number
  horizontal: boolean
  virtualize: boolean
  animation: number
}

type ControlsProps = {
  controls: Controls
  setControls: (prev: (prev: Controls) => Controls) => void
}

export function Controls({ controls, setControls }: ControlsProps) {
  const onChangeControls = (value: string | number | boolean, name: string) => {
    setControls((prev: Controls) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={classes.sticky}>
      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Item Count: {controls.itemCount}
          </span>
          <input
            className={classes.range}
            name="itemCount"
            type="range"
            min="1000"
            max="10000"
            step="1000"
            list="count"
            value={controls.itemCount}
            onChange={(event) => {
              const { name, value } = event.target
              onChangeControls(parseInt(value), name)
            }}
          />
          <datalist id="count">
            <option value="0"></option>
            <option value="1000"></option>
            <option value="2000"></option>
            <option value="3000"></option>
            <option value="4000"></option>
            <option value="5000"></option>
            <option value="6000"></option>
            <option value="7000"></option>
            <option value="8000"></option>
            <option value="9000"></option>
            <option value="10000"></option>
          </datalist>
        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Gap: {controls.gap}px
          </span>
          <input
            className={classes.range}
            name="gap"
            type="range"
            min="0"
            step="5"
            max="40"
            value={controls.gap}
            list="gap"
            onChange={(event) => {
              const { name, value } = event.target
              onChangeControls(parseInt(value), name)
            }}
          />
          <datalist id="gap">
            <option value="0"></option>
            <option value="5"></option>
            <option value="10"></option>
            <option value="15"></option>
            <option value="20"></option>
            <option value="25"></option>
            <option value="30"></option>
            <option value="35"></option>
            <option value="40"></option>
          </datalist>
        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Padding: {controls.padding}px
          </span>
          <input
            className={classes.range}
            name="padding"
            type="range"
            min="0"
            max="40"
            step="5"
            list="padding"
            value={controls.padding}
            onChange={(event) => {
              const { name, value } = event.target
              onChangeControls(parseInt(value), name)
            }}
          />
          <datalist id="padding">
            <option value="0"></option>
            <option value="5"></option>
            <option value="10"></option>
            <option value="15"></option>
            <option value="20"></option>
            <option value="25"></option>
            <option value="30"></option>
            <option value="35"></option>
            <option value="40"></option>
          </datalist>
        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Off-screen Pages: {controls.offScreenPages}
          </span>
          <input
            className={classes.range}
            name="offScreenPages"
            type="range"
            min="1"
            max="5"
            step="1"
            value={controls.offScreenPages}
            list="offScreenPages"
            onChange={(event) => {
              const { name, value } = event.target
              onChangeControls(parseFloat(value), name)
            }}
          />
          <datalist id="offScreenPages">
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
          </datalist>

        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Animation: {controls.animation/10}s
          </span>
          <input
            className={classes.range}
            name="animation"
            type="range"
            min="0"
            max="10"
            step="1"
            value={controls.animation}
            list="animation"
            onChange={(event) => {
              const { name, value } = event.target
              onChangeControls(parseFloat(value), name)
            }}
          />
          <datalist id="animation">
            <option value="0"></option>
            <option value="1"></option>
            <option value="2"></option>
            <option value="3"></option>
            <option value="4"></option>
            <option value="5"></option>
            <option value="6"></option>
            <option value="7"></option>
            <option value="8"></option>
            <option value="9"></option>
            <option value="10"></option>
          </datalist>

        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Virtualize
          </span>
          <input
            type="checkbox"
            name="virtualize"
            checked={controls.virtualize}
            onChange={(event) => {
              const { name, checked } = event.target
              onChangeControls(checked, name)
            }}
          />
        </label>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <label className={classes.label}>
          <span className={classes.labelText}>
            Horizontal Scroll
          </span>
          <input
            type="checkbox"
            name="horizontal"
            checked={controls.horizontal}
            onChange={(event) => {
              const { name, checked } = event.target
              onChangeControls(checked, name)
            }}
          />
        </label>
      </fieldset>
    </div>
  )
}

