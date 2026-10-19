import emptypesquisar from "@/assets/empty-pesquisar.svg";

export function EmptyPesquisar() {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <img
          src={emptypesquisar}
          alt="Nada encontrado"
          className="mx-auto max-h-[32rem] w-auto"
        />
      </div>
    </div>
  );
}
