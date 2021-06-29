import Search from 'antd/lib/input/Search';
import React, { useCallback } from 'react';

interface SearchInputProps {
  searchFunction: (value: string) => any;
}

export function SearchInput(props: SearchInputProps) {
  const { searchFunction } = props;

  const onSearch = useCallback(
    (searchInput) => {
      searchFunction(searchInput);
    },
    [searchFunction],
  );

  return <Search placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />;
}
