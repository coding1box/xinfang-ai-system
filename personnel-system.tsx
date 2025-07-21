import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CommandDialog, CommandInput, CommandList, CommandItem } from "@/components/ui/command";

// 人员类型
interface Personnel {
  name: string;
  gender: string;
  age: number;
  id: string;
}

export default function PersonnelSystem() {
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Personnel[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // mock数据
  const personnelList: Personnel[] = [
    { name: "张三", gender: "男", age: 30, id: "510101199001010011" },
    { name: "张三", gender: "男", age: 42, id: "510101198201010022" },
    { name: "张三", gender: "女", age: 28, id: "510101199601010033" },
    { name: "李四", gender: "男", age: 35, id: "510101198901010044" },
    { name: "王五", gender: "女", age: 25, id: "510101199901010055" },
  ];

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearchOpen(false);
    if (!searchValue) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    searchTimer.current = setTimeout(() => {
      const results = personnelList.filter(p => p.name.includes(searchValue));
      setSearchResults(results);
      setSearchLoading(false);
      setSearchOpen(true);
    }, 1000);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchValue]);

  return (
    <div style={{ padding: 40 }}>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder="搜索信访人员"
          autoFocus
        />
        <CommandList>
          {searchLoading ? (
            <div className="p-4 text-center text-gray-400">加载中...</div>
          ) : searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-400">无匹配结果</div>
          ) : (
            searchResults.map((p, idx) => (
              <CommandItem key={idx} value={p.name + p.id} onSelect={() => setSearchOpen(false)}>
                <div className="flex flex-col">
                  <span><b>姓名：</b>{p.name} <b>性别：</b>{p.gender} <b>年龄：</b>{p.age}</span>
                  <span className="text-xs text-gray-500"><b>身份证号：</b>{p.id}</span>
                </div>
              </CommandItem>
            ))
          )}
        </CommandList>
      </CommandDialog>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 32 }}>
        <Input
          placeholder="搜索信访人员"
          className="w-64"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Button>
          <Search className="w-4 h-4 mr-1" />
          搜索
        </Button>
      </div>
    </div>
  );
}
