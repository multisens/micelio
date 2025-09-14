import React, { useEffect, useState } from "react";
import './style.css';

function GraphConfigPanel({ graphKey, config, availableData, selectedItems, setSelectedItems, handleCheckboxChange }) {
    const requirements = config.requirements || { inputs: {}, parameters: {} };
    const { activities, agents, entities } = availableData;

    const selected = selectedItems[graphKey] || {
        activities: [],
        agents: [],
        entities: [],
        image: { type: "url", source: "" },
        parameters: {}
    };


    useEffect(() => {
        if (
            requirements.parameters &&
            Object.keys(requirements.parameters).length > 0 &&
            (!selected.parameters || Object.keys(selected.parameters).length === 0)
        ) {
            const defaultParameters = Object.fromEntries(
                Object.entries(requirements.parameters).map(([key, param]) => [key, param.default])
            );

            setSelectedItems(prev => ({
                ...prev,
                [graphKey]: {
                    ...selected,
                    parameters: defaultParameters
                }
            }));
        }
    }, [graphKey, requirements.parameters, selected, setSelectedItems]);

    const [imageSource, setImageSource] = useState(selected.image?.source || "");

    const updateSelected = (newData) => {
        setSelectedItems(prev => ({ ...prev, [graphKey]: { ...selected, ...newData } }));
    };


    function getBase64ImageDimensions(base64) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = reject;
            img.src = base64;
        });
    }


    const renderCheckboxGroup = (label, data, type) => (
        <fieldset className="checkbox-grid scrollable">
            <legend>{label}</legend>
            {data.map((item, index) => (
                <label key={`${graphKey}-${type}-${index}`}>
                    <input
                        type="checkbox"
                        value={item.name}
                        checked={selected[type]?.includes(item.name)}
                        onChange={(e) => {
                            const updated = { ...selected };
                            handleCheckboxChange(e, updated[type], (newList) => {
                                updated[type] = newList;
                                setSelectedItems((prev) => ({ ...prev, [graphKey]: updated }));
                            });
                        }}
                    />
                    {item.name}
                </label>
            ))}
        </fieldset>
    );

    const renderParameterFields = () => (
        <fieldset className="parameters-fieldset">
            <legend>Parâmetros</legend>
            {Object.entries(requirements.parameters).map(([key, param]) => (
                <label key={key} style={{ display: "block", marginBottom: "0.5rem" }}>
                    {param.label || key}
                    <input
                        type={param.type === "number" ? "number" : "text"}
                        value={selected.parameters?.[key] ?? param.default}
                        onChange={(e) => {
                            const value = param.type === "number"
                                ? parseFloat(e.target.value)
                                : e.target.value;
                            updateSelected({
                                parameters: {
                                    ...selected.parameters,
                                    [key]: value
                                }
                            });
                        }}
                        style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
                    />
                </label>
            ))}
        </fieldset>
    );

    const renderImageConfig = () => (
        <fieldset className="image-config-fieldset">
            <legend>Imagem do Mapa de Fundo</legend>

            {/* Input para URL */}
            <div style={{ marginTop: '1rem' }}>
                <label>Ou informe uma URL:</label>
                <input
                    type="text"
                    placeholder="https://..."
                    value={imageSource}
                    onChange={e => setImageSource(e.target.value)}
                    onBlur={async () => {
                        const url = imageSource.trim();
                        if (!url) return;
                        try {
                            const img = new Image();
                            img.crossOrigin = 'Anonymous';
                            img.src = url;
                            await new Promise((res, rej) => {
                                img.onload = res;
                                img.onerror = rej;
                            });
                            updateSelected({
                                image: { type: "url", source: url, width: img.naturalWidth, height: img.naturalHeight }
                            });
                        } catch (err) {
                            console.error("Erro ao carregar imagem da URL:", err);
                            updateSelected({ image: { type: "url", source: url } });
                        }
                    }}
                    style={{ display: "block", width: "100%", marginTop: "0.5rem" }}
                />
            </div>
        </fieldset>
    );

    return (
        <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #ccc' }}>
            {requirements.inputs.activities && activities && renderCheckboxGroup("Atividades", activities, "activities")}
            {requirements.inputs.agents && agents && renderCheckboxGroup("Agentes", agents, "agents")}
            {requirements.inputs.entities && entities && renderCheckboxGroup("Entidades", entities, "entities")}
            {requirements.inputs.image && renderImageConfig()}
            {Object.keys(requirements.parameters || {}).length > 0 && renderParameterFields()}
        </div>
    );
}

export default GraphConfigPanel;
