import  { type Dispatch, type SetStateAction } from 'react'
import Section from './Section';
import type { Genre, TabItem } from '../../types';

interface TabProp {
    tabs: TabItem[];
    selectedTab: string;
    setSelectedTab: Dispatch<SetStateAction<string>>; 
}

export default function Tab({tabs, selectedTab, setSelectedTab}:TabProp) {
  return (
    <div className="Tabs col-span-2">
          <div className="TabName hidden md:flex justify-evenly mb-1 ">
            {tabs.filter((tab)=>Object.keys(tab.tabContent).length !== 0 && tab.tabContent.constructor === Object).map((tab: TabItem, i: number) => (
              <span className="w-full font-bold border-b-2 text-center hover:cursor-pointer hover:text-[#ab76f5] hover:border-b-[#ab76f5]" key={i}
              onClick={()=>setSelectedTab(tab.tabName)}>{tab.tabName}</span>
            ))}
          </div>
          <div className="TabContent min-h-110">
            {tabs.filter((tab: TabItem) => tab.tabName === selectedTab).map(
              (tab: TabItem) => (
                <div key={tab.tabName} className="flex flex-col gap-2">
                  {Object.entries(tab.tabContent).map(([key, value]) => {
                    // Only render if there is content to show
                    if (value) {
                      let info;
                      if(key === "genres"){
                        info = value.map((g:Genre)=>g.genre).join("/")
                      }else if(key === "runtime"){
                        info = value + "min"
                      }else{
                        info = value
                      }
                      const title = key.split("_").map(word=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
                      return (
                        <Section
                          key={key}
                          sectionName={title}
                          sectionContent={String(info)}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              ),
            )}
          </div>
          </div>
  )
}
