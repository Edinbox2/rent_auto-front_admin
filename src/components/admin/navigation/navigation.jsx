import React from 'react';
import {Link} from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const Navigation = (props) => {

const links = [
    {
        name: 'Автопарк',
        linkTo: '/cars'
    }, 
    {
        name: 'Добавить Авто',
        linkTo: '/add'
    }, 
    {
        name: 'Дополнительно',
        linkTo: '/options'
    }, 

]

const style = {
    color: "#ffffff",
    fontWeight: "300",
    borderBottom: "1px solid #353535",
    fontSize: "20px"
}
    const navigationLinks=()=>(
        links.map((item, i)=>(
            <Link to={`/dashboard${item.linkTo}`} key={i}>
            <ListItem button style={style}>
                {item.name}
            </ListItem>
            
            </Link>
        ))
    )

    return (    
        <List>
            {navigationLinks()}
            <ListItem button style={style}><Link to="/logout">Выйти</Link></ListItem>
        </List>
    );
};

export default Navigation;