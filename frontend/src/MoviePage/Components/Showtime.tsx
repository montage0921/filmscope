import HoverLabel from '../../Utility/HoverLabel';
import type { Screening, ShowInfo } from '../../types';
import { Mic, Star } from 'lucide-react';
import ScreeningCard from './ScreeningCard';


interface ShowTimeProps {
    showInfo: Record<string, Record<string, ShowInfo>>; 
}

export default function Showtime({ showInfo }: ShowTimeProps) {
  return (
    <div className="Showtime col-span-1 text-center text-gray-300">
      <div className="w-full font-medium border-b-2 text-center mb-2 border-gray-700">
        Showtimes
      </div>
      <div>
        {/*1. first iteration layer: date */}
        {(Object.entries(showInfo || {}) as [string, Record<string, ShowInfo>][])
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
          .map(([date, theatres], _) => {
            const formattedDate = new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <div key={date} className="flex flex-col mb-6">
                {/* Date */}
                <div className="Date flex items-center gap-2 text-sm mb-3">
                  <div className="grow border-t border-gray-600"></div>
                  <span className="text-gray-400 font-mono">{formattedDate}</span>
                  <div className="grow border-t border-gray-600"></div>
                </div>

                <div className="self-start w-full">
                  {/* 2. Second Iteration Layer: Theatre under one Date*/}
                  {(Object.entries(theatres) as [string, ShowInfo][]).map(
                    ([theatre, detailShowInfo]) => (
                      <div key={detailShowInfo?.show_id} className="ScreeningsContainer flex flex-col gap-2 mb-4">
                        {/* Theatre Name + QA/Special Label */}
                        <div className="Show text-[12px] flex items-center gap-1 px-4 text-gray-400">
                          <span className="font-bold">{theatre}</span>
                          {detailShowInfo.qa_with && (
                            <HoverLabel
                              icon={Mic}
                              iconSize={14}
                              content={"QA with " + detailShowInfo.qa_with}
                            />
                          )}
                          {detailShowInfo.special && (
                            <HoverLabel
                              icon={Star}
                              iconSize={14}
                              content={detailShowInfo.special}
                            />
                          )}
                        </div>

                        {/* 3. Third Iteration Layer: Screening of each Theatre */}
                        <div className="flex flex-col gap-2 justify-center items-center">
                          {detailShowInfo?.screenings
                            ?.slice()
                            .sort((a: Screening, b: Screening) =>
                              a.start_time.localeCompare(b.start_time)
                            )
                            .map((screen: Screening) => (
                              <ScreeningCard
                                key={screen.screening_id}
                                screen={screen}
                                theatre={theatre}
                              />
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  )
}