import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
} from "react-admin";

const ShowTimeList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
    </Datagrid>
  </List>
);

export default ShowTimeList;
