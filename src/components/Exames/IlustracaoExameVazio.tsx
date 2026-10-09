import halo from '@/assets/exames/halo.svg'
import bolhaEsquerda from '@/assets/exames/bolha-esquerda.svg'
import bolhaSuperior from '@/assets/exames/bolha-superior.svg'
import bolhaDireita from '@/assets/exames/bolha-direita.svg'
import relogio from '@/assets/exames/relogio.svg'
import centroRelogio from '@/assets/exames/centro-relogio.svg'

export function IlustracaoExameVazio() {
  return (
    <div className="relative h-[147px] w-[202px] shrink-0" aria-hidden="true">
      <img src={halo} alt="" className="absolute left-[10px] top-[13px]" />
      <img src={bolhaEsquerda} alt="" className="absolute left-[19px] top-[52px]" />
      <img src={bolhaSuperior} alt="" className="absolute left-[150px] top-[12px]" />
      <img src={bolhaDireita} alt="" className="absolute left-[183px] top-[80px]" />
      <div className="absolute left-[56px] top-[16px] h-[113px] w-[92px] overflow-hidden rounded-[12px] border-[1.5px] border-[#c8d8f4] bg-white shadow-[0_5px_10px_rgba(61,92,153,0.12)]">
        <span className="absolute -top-[2px] right-0 h-6 w-[22px] rounded-[5px] bg-[#d9e7ff]" />
        <span className="absolute left-[15px] top-[16px] h-2 w-[43px] rounded bg-[#69f]" />
        <span className="absolute left-[15px] top-[41px] h-[5px] w-[56px] rounded bg-[#cbd9f0]" />
        <span className="absolute left-[15px] top-[54px] h-[5px] w-[47px] rounded bg-[#cbd9f0]" />
        <span className="absolute left-[15px] top-[67px] h-[5px] w-[35px] rounded bg-[#cbd9f0]" />
        <span className="absolute left-[15px] top-[82px] rounded-[5px] bg-[#e8f0ff] px-2 py-0.5 text-[9px] font-bold text-[#3d5c99]">PDF</span>
      </div>
      <img src={relogio} alt="" className="absolute left-[124px] top-[83px]" />
      <span className="absolute left-[149px] top-[95px] h-[15px] w-[3px] rounded bg-[#3d5c99]" />
      <span className="absolute left-[150px] top-[108px] h-[3px] w-[11px] rounded bg-[#3d5c99]" />
      <img src={centroRelogio} alt="" className="absolute left-[148px] top-[106px]" />
    </div>
  )
}
