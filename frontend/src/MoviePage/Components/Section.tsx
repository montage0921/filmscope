
interface SectionProps{
    sectionName:string,
    sectionContent:string
}

export default function Section({sectionName, sectionContent}:SectionProps) {
  return (
    <div className='flex flex-col '>
        {sectionName !== "Plot" && <div>{sectionName}</div>}
        <div className="text-gray-300 pr-7 text-sm">{sectionContent}</div>
    </div>
  )
}
