import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '0 auto',
    paddingTop: theme.spacing(8),
    maxWidth: 800,
  },
  sectionTitle: {
    marginBottom: theme.spacing(3),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  cardMedia: {
    height: 160,
    backgroundColor: theme.palette.grey[800],
  },
}));

const templates = [
  {
    title: 'Landing Page like Booking.com',
    description: 'Next.js + Tailwind CSS + shadcn/ui',
    image: '/images/booking-landing.png',
  },
  {
    title: 'Landing Page like Mailchimp',
    description: 'Server actions and Zod validation',
    image: '/images/mailchimp-landing.png',
  },
  {
    title: 'Checkout Page like Stripe',
    description: 'Build charts using shadcn/ui charts',
    image: '/images/templates/nextjs-charts.png',
  },
];

const StarterTemplates = () => {
  const classes = useStyles();

  return (
    <Box>
      <Typography variant='h6' className={classes.sectionTitle}>
        Starter Templates
      </Typography>
      <Grid container spacing={3}>
        {templates.map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={template.image}
                title={template.title}
              />
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  {template.title}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {template.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StarterTemplates;
