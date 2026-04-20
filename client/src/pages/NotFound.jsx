import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="text-center py-20">
    <p className="text-sm uppercase tracking-wide text-muted">404</p>
    <h1 className="text-4xl font-semibold text-primary">Page not found</h1>
    <p className="text-muted mt-3">Looks like the link is broken. Let's get you back on track.</p>
    <Link className="mt-5 inline-flex px-6 py-3 bg-accent text-white rounded-full" to="/">
      Return home
    </Link>
  </div>
);

export default NotFound;
