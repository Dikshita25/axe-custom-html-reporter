"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareReportData = void 0;
const getWcagReference_1 = require("./getWcagReference");
function simplifyAxeResultForSummary(results) {
    return results.map(({ nodes, description, help, id, tags, impact }, resultIndex) => ({
        index: resultIndex + 1,
        description,
        id,
        help,
        wcag: getWcagReference_1.getWcagReference(tags),
        tags,
        impact: impact || 'n/a',
        nodes: nodes.length,
    }));
}
function prepareFixSummary(failureSummary, defaultHighlight) {
    const failureSummariesSplit = failureSummary.split('\n\n');
    return failureSummariesSplit.map((summary) => {
        const fixSummarySplit = summary.split('\n');
        if (fixSummarySplit.length == 0) {
            return defaultHighlight;
        }
        else {
            return {
                highlight: fixSummarySplit.shift() || '',
                list: fixSummarySplit,
            };
        }
    });
}
/**
 * Prepare report splitting it into sections:
 * - total accessibility violations (counting nodes)
 * - summary of violations that could be printed as table
 * - detailed list of violations that could be printed as formatted text
 */
function prepareReportData({ violations, passes, incomplete, inapplicable, }) {
    const passedChecks = passes ? simplifyAxeResultForSummary(passes) : undefined;
    const incompleteChecks = incomplete ? simplifyAxeResultForSummary(incomplete) : undefined;
    const inapplicableChecks = inapplicable ? simplifyAxeResultForSummary(inapplicable) : undefined;
    const violationsTotal = violations.reduce((acc, { nodes }) => {
        acc += nodes.length;
        return acc;
    }, 0);
    if (violations.length === 0) {
        return {
            violationsSummary: 'axe-core found <span class="badge badge-success">0</span> violations',
            checksPassed: passedChecks,
            checksIncomplete: incompleteChecks,
            checksInapplicable: inapplicableChecks,
        };
    }
    const violationsSummary = `axe-core found <span class="badge badge-warning">${violationsTotal}</span> violation${violationsTotal === 1 ? '' : 's'}`;
    // Prepare data to show summary
    const violationsSummaryTable = simplifyAxeResultForSummary(violations);
    // Prepare data to show detailed list of violations
    const violationsDetails = violations.map(({ nodes, impact, description, help, id, tags, helpUrl, specName }, issueIndex) => {
        return {
            index: issueIndex + 1,
            wcag: getWcagReference_1.getWcagReference(tags),
            tags,
            id,
            impact: impact || 'n/a',
            description,
            help,
            helpUrl,
            nodes: nodes.map(({ target, html, failureSummary, any }, nodeIndex) => {
                const targetNodes = target.join('\n');
                const defaultHighlight = {
                    highlight: 'Recommendation with the fix was not provided by axe result',
                };
                const fixSummaries = failureSummary
                    ? prepareFixSummary(failureSummary, defaultHighlight)
                    : [defaultHighlight];
                const relatedNodesAny = [];
                any.forEach((checkResult) => {
                    if (checkResult.relatedNodes && checkResult.relatedNodes.length > 0) {
                        checkResult.relatedNodes.forEach((node) => {
                            if (node.target.length > 0) {
                                relatedNodesAny.push(node.target.join('\n'));
                            }
                        });
                    }
                });
                return {
                    targetNodes,
                    html,
                    fixSummaries,
                    relatedNodesAny,
                    index: nodeIndex + 1,
                    specName,
                };
            }),
        };
    });
    return {
        violationsSummary,
        violationsSummaryTable,
        violationsDetails,
        checksPassed: passedChecks,
        checksIncomplete: incompleteChecks,
        checksInapplicable: inapplicableChecks,
    };
}
exports.prepareReportData = prepareReportData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlcGFyZVJlcG9ydERhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9wcmVwYXJlUmVwb3J0RGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx5REFBc0Q7QUFJdEQsU0FBUywyQkFBMkIsQ0FBQyxPQUFpQjtJQUNsRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLEtBQUssRUFBRSxXQUFXLEdBQUcsQ0FBQztRQUN0QixXQUFXO1FBQ1gsRUFBRTtRQUNGLElBQUk7UUFDSixJQUFJLEVBQUUsbUNBQWdCLENBQUMsSUFBSSxDQUFDO1FBQzVCLElBQUk7UUFDSixNQUFNLEVBQUUsTUFBTSxJQUFJLEtBQUs7UUFDdkIsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNO0tBQ3RCLENBQUMsQ0FBQyxDQUFDO0FBQ1IsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsY0FBc0IsRUFBRSxnQkFBNEI7SUFDM0UsTUFBTSxxQkFBcUIsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNELE9BQU8scUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDekMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QyxJQUFJLGVBQWUsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1lBQzdCLE9BQU8sZ0JBQWdCLENBQUM7U0FDM0I7YUFBTTtZQUNILE9BQU87Z0JBQ0gsU0FBUyxFQUFFLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO2dCQUN4QyxJQUFJLEVBQUUsZUFBZTthQUN4QixDQUFDO1NBQ0w7SUFDTCxDQUFDLENBQUMs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