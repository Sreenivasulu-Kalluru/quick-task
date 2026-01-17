import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title} | QuickTask</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default SEO;
