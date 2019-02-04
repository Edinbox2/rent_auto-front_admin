import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { FormattedMessage } from "react-intl";
const Navigation = props => {
  const links = [
    {
      name: "Cars",
      linkTo: "/cars",
      lang: "nav.cars"
    },
    {
      name: "Add car",
      linkTo: "/add",
      lang: "nav.addcar"
    },
    {
      name: "Options",
      linkTo: "/options",
      lang: "nav.options"
    }
  ];

  const style = {
    color: "#ffffff",
    fontWeight: "300",
    borderBottom: "1px solid #353535",
    fontSize: "20px"
  };
  const navigationLinks = () =>
    links.map((item, i) => (
      <Link to={`/dashboard${item.linkTo}`} key={i}>
        <ListItem button style={style}>
          <FormattedMessage
            id={item.lang}
            defaultMessage={item.name}
            values={{ name: item.name }}
          />
        </ListItem>
      </Link>
    ));

  return (
    <List>
      {navigationLinks()}
      <ListItem button style={style}>
        <Link to="/logout">
          <FormattedMessage
            id="nav.logout"
            defaultMessage="Log out"            
          />
        </Link>
      </ListItem>
    </List>
  );
};

export default Navigation;
