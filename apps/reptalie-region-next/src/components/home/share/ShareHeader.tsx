'use client';

import Search from '@/assets/icons/search.svg';
import Header from '@/components/ui/layouts/Header';

const ShareHeader = () => {
    return <Header right={<div>{<Search />}</div>} />;
};

export default ShareHeader;
