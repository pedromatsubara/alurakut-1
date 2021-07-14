import { useState, useEffect } from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
	AlurakutMenu,
	AlurakutProfileSidebarMenuDefault,
	OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import comunidadesEstaticas from "../src/lib/data/comunidadesEstaticas";

function ProfileSidebar(propriedades) {
	return (
		<Box as="aside">
			<img
				src={`https://github.com/${propriedades.githubUser}.png`}
				style={{ borderRadius: "8px" }}
			/>
			<hr />

			<p>
				<a
					className="boxLink"
					href={`https://github.com/${propriedades.githubUser}`}
				>
					@{propriedades.githubUser}
				</a>
			</p>
			<hr />

			<AlurakutProfileSidebarMenuDefault />
		</Box>
	);
}

export default function Home() {
	const usuarioAleatorio = "pedromatsubara";

	const [maxAlurakuteiros, setMaxAlurakuteiros] = useState(6);
	const [comunidades, setComunidades] = useState(comunidadesEstaticas);

	const [alurakuteiros, setAlurakuteiros] = useState([
		"juunegreiros",
		"omariosouto",
		"peas",
		"rafaballerini",
		"marcobrunodev",
		"felipefialho",
	]);

	useEffect(() => {
		fetch(
			"https://raw.githubusercontent.com/alura-challenges/alurakut/main/README.md"
		)
			.then((data) => data.text())
			.then((data) => {
				const extractedNames = data
					.split(
						"/cf9f1db04b6e4e2b7a984902d69b889f717d09cb94b8b4296ffffc16d0c73120/"
					)
					.map((text) => text.split("/")[0]);
				extractedNames.shift();
				setAlurakuteiros(extractedNames);
			});
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const dadosDoForm = new FormData(e.target);
		const comunidade = {
			id: new Date().toISOString(),
			title: dadosDoForm.get("title"),
			// image: dadosDoForm.get("image"),
			image: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
		};
		const comunidadesAtualizadas = [...comunidades, comunidade];
		setComunidades(comunidadesAtualizadas);
	};

	return (
		<>
			<AlurakutMenu githubUser={usuarioAleatorio} />
			<MainGrid>
				{/* <Box style="grid-area: profileArea;"> */}
				<div className="profileArea" style={{ gridArea: "profileArea" }}>
					<ProfileSidebar githubUser={usuarioAleatorio} />
				</div>
				<div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form onSubmit={(e) => handleSubmit(e)}>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usarmos de capa"
									name="image"
									aria-label="Coloque uma URL para usarmos de capa"
								/>
							</div>

							<button>Criar comunidade</button>
						</form>
					</Box>
				</div>
				<div
					className="profileRelationsArea"
					style={{ gridArea: "profileRelationsArea" }}
				>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
						<ul>
							{comunidades.slice(0, 6).map((itemAtual) => {
								return (
									<li key={itemAtual.id}>
										<a href={`/users/${itemAtual.title}`} target="_blank">
											<img src={itemAtual.image} />
											<span>{itemAtual.title}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da comunidade ({alurakuteiros.length})
						</h2>

						<ul>
							{alurakuteiros.slice(0, maxAlurakuteiros).map((itemAtual) => {
								return (
									<li key={itemAtual}>
										<a href={`https://github.com/${itemAtual}`} target="_blank">
											<img src={`https://github.com/${itemAtual}.png`} />
											<span>{itemAtual}</span>
										</a>
									</li>
								);
							})}
							<button onClick={() => setMaxAlurakuteiros(maxAlurakuteiros+9)}>Ver mais...</button>
						</ul>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	);
}
