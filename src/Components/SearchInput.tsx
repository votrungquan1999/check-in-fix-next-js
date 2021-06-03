import Search from 'antd/lib/input/Search';
import React, { useState, useCallback } from 'react';
import { searchCustomers } from '../services/customers';

interface SearchInputProps {
  searchFunction: (value: string) => any;
}

export function SearchInput(props: SearchInputProps) {
  const { searchFunction } = props;

  const onSearch = useCallback(
    (searchInput) => {
      // async function handleSearch() {
      //   const values = await searchFunction(searchInput);

      //   setSearchResult(values);
      // }

      // handleSearch();

      searchFunction(searchInput);
    },
    [searchFunction],
  );

  return <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />;
}
