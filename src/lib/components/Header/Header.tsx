import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import { Grid, Toolbar, Typography } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem/ListItem';
import List from '@material-ui/core/List/List';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useStyles } from './Header.styles';
import { PostCreationMenu } from '../PostCreationMenu';
import { LoginModal } from '../Modals/LoginModal';
import { RootStateType } from '../../../store/rootReducer';
import LogOutButton from '../LogOutButton';

interface IHeaderProps {
  id: string;
  label: string;
  url?: string;
}

export const navElems: IHeaderProps[] = [
  {
    id: 'main',
    label: 'Головна',
    url: '/',
  },
  {
    id: 'covid-19',
    label: 'Covid-19',
    url: '/direction/covid-19',
  },
  {
    id: 'directions',
    label: 'Напрямки',
    url: '/direction',
  },
  {
    id: 'experts',
    label: 'Експерти',
    url: '/experts',
  },
  {
    id: 'translates',
    label: 'Переклади',
  },
];

const Header: React.FC = () => {
  const classes = useStyles();
  const { user } = useSelector((state: RootStateType) => state.currentUser);

  const allLinks = navElems.map((item) => (
    <Link
      key={item.id}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      to={(location) => ({ ...location, pathname: item.url || '#' })}
      className={classes.items}
    >
      {item.label}
    </Link>
  ));

  return (
    <div className="header">
      <Grid container>
        <Grid item xs={12}>
          <Toolbar className={classes.toolbar}>
            <Link to="/">
              <div className={classes.logo}>
                <LocalHospitalIcon fontSize="large" />
                <Typography
                  component="h2"
                  variant="h5"
                  color="inherit"
                  align="center"
                  noWrap
                >
                  Dokazovi
                </Typography>
              </div>
            </Link>

            <div className={classes.postCreationMenu}>
              <PostCreationMenu />
            </div>

            <div className={classes.logIn}>
              <AccountCircleIcon fontSize="large" />
              {user ? <LogOutButton /> : <LoginModal />}
            </div>
          </Toolbar>
        </Grid>
        <Grid item xs={12}>
          <List className={classes.generalNavigation}>
            <ListItem>{allLinks}</ListItem>
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
