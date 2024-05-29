import "./styles.css";
import { useVirtualGrid } from "./useVirtualGrid";
import { useMemo, useState } from "react";

import {
  Grid,
  Card,
  Image,
  Index,
  Scroll,
  Gui,
  Field,
  Label,
  Input,
  Checkbox
} from "./components";

const Item = ({ url, index }) => (
  <Card key={url} data-index={index}>
    {url && <Image src={url} />}
    <Index children={index} />
  </Card>
);

export default function App() {
  const [items, setItems] = useState(200);
  const [virtualized, setVirtualized] = useState(true);
  const [horizontal, setHorizontal] = useState(false);

  const data = useMemo(
    () =>
      Array(items)
        .fill(true)
        .map((_, index) => ({
          index // <--- required
          // url: `https://picsum.photos/id/${index}/300/370`
        })),
    [items]
  );

  const { content } = useVirtualGrid({
    gap: 20,
    padding: 20,
    data,
    horizontal,
    itemElement: <Item />,
    gridElement: <Grid horizontal={horizontal} />
  });

  return (
    <>
      <Gui>
        <Field>
          <Label>Items</Label>
          <Input
            type="number"
            value={items}
            onChange={(e) => setItems(Number(e.target.value))}
          />
        </Field>
        <Field>
          <Label>Virtualize</Label>
          <Checkbox
            type="checkbox"
            checked={virtualized}
            onChange={(e) => setVirtualized(!virtualized)}
          />
        </Field>
        <Field>
          <Label>Horizontal</Label>
          <Checkbox
            type="checkbox"
            checked={horizontal}
            onChange={(e) => setHorizontal(!horizontal)}
          />
        </Field>
      </Gui>
      <Scroll>
        {virtualized ? (
          content
        ) : (
          <FullList data={data} horizontal={horizontal} />
        )}
      </Scroll>
    </>
  );
}

const FullList = ({ horizontal, data }) => {
  return (
    <Grid horizontal={horizontal}>
      {data.map((props) => (
        <Item {...props} key={props.index} />
      ))}
    </Grid>
  );
};

