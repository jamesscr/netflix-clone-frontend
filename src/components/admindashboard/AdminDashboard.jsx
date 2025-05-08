import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import './admindashboard.scss';

const AdminDashboard = () => {
  return (
    <Paper className="admin-dashboard" elevation={3}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur le Tableau de Bord Administrateur
      </Typography>
      <Typography variant="h6" gutterBottom>
        Comment utiliser ce tableau de bord :
      </Typography>
      <List>
      <ListItem>
          <ListItemText 
            primary="1. Afficher / Cacher la barre latérale." 
            secondary="Cliquer sur la barre explorateur pour afficher ou masquer la barre latérale."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="2. Navigation" 
            secondary="Utilisez la barre latérale pour naviguer entre les différentes sections du tableau de bord."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="3. Home" 
            secondary="Visiter la page d'accueil du site web."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="4. Gestion des Films" 
            secondary="Cliquez sur 'Movies' pour voir la liste des films, les modifier ou les supprimer."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="5. Ajouter un Film" 
            secondary="Ajouter un nouveau film à votre liste en cliquant sur 'Add Video' et remplissant les champs demandés."
          />
        </ListItem>
        <ListItem>
          <ListItemText 
            primary="6. Déconnexion" 
            secondary="Pour vous déconnecter, utilisez le bouton de déconnexion en bas de la barre latérale."
          />
        </ListItem>
      </List>
      <Typography variant="body1" className="footer-note">
        Pour toute assistance supplémentaire, veuillez contacter l'équipe de support technique.
      </Typography>
    </Paper>
  );
};

export default AdminDashboard;