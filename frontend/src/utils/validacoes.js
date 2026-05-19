export const validarAgendamento = ({
  salaId,
  data,
  horarioInicio,
  horarioFim,
  salas,
  agendamentos,
  agendamentoIdIgnorado = null // Usado apenas na edição para não conflitar com si mesmo
}) => {

  // 1. Verifica se a sala selecionada é válida
  const salaObj = salas.find(sala => sala.id === salaId);
  if (!salaObj) return { valido: false, erro: 'Sala selecionada inválida.' };

  // 2. Verifica se a data selecionada é no passado
  const dataHoje = new Date();
  dataHoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas o dia
  const dataEscolhida = new Date(data + 'T00:00:00'); // T00:00:00 evita bug de fuso horário

  if (dataEscolhida < dataHoje) return { valido: false, erro: 'A data selecionada não pode ser no passado.' };

  // 3. Verifica se o horário de início é antes do horário de fim
  if (horarioInicio >= horarioFim) return { valido: false, erro: 'O horário de início deve ser antes do horário de fim.' };

  // 4. Verifica se o horário está dentro do funcionamento da sala
  if (horarioInicio < salaObj.horario_abertura || horarioFim > salaObj.horario_fechamento) {
    return { valido: false, erro: `O horário deve estar entre ${salaObj.horario_abertura} e ${salaObj.horario_fechamento}.` };
  }

  // 5. Verifica conflitos com outros agendamentos
  const conflitos = agendamentos.filter(agendamento => {
    // Se for edição, ignora a própria reunião na checagem
    if (agendamentoIdIgnorado && agendamento.id === agendamentoIdIgnorado) return false;

    return agendamento.sala_id === salaId &&
           agendamento.data === data &&
           ((horarioInicio >= agendamento.horario_inicio && horarioInicio < agendamento.horario_fim) ||
            (horarioFim > agendamento.horario_inicio && horarioFim <= agendamento.horario_fim) ||
            (horarioInicio <= agendamento.horario_inicio && horarioFim >= agendamento.horario_fim));
  });

  if (conflitos.length > 0) return { valido: false, erro: 'O horário selecionado conflita com outro agendamento.' };

  return { valido: true };
};
